# run.py
import time
import json
from collections import deque

import cv2
import numpy as np
from ultralytics import YOLO


# ==================== Simple stats tracker ====================
class PassCounter:
    """
    Hackathon-friendly stats:
      - Possession time per team (seconds)
      - Passes: when nearest-owner team switches from TeamA <-> TeamA or TeamB <-> TeamB
      - Goals: updated externally via add_goal()
    """
    def __init__(self):
        self.passes = {"TeamA": 0, "TeamB": 0}
        self.possession_seconds = {"TeamA": 0.0, "TeamB": 0.0}
        self.goals = {"TeamA": 0, "TeamB": 0}

        self.last_owner_team = None
        self.last_update_time = None  # timeline in seconds (we use frame_idx/fps)

    def update(self, now_t, ball_xy, players):
        """
        now_t: timeline seconds (frame_idx/fps)
        ball_xy: (bx, by) or None
        players: list of {'team','x','y','w','h'} — team may be "Unknown"
        """
        if not players or ball_xy is None:
            # still move the clock forward (no team gets time if no owner)
            self.last_update_time = now_t
            return None

        bx, by = ball_xy

        # Nearest rectangle center to ball (ties broken by last min)
        min_d2 = float("inf")
        closest_team = None
        for p in players:
            cx = p["x"] + p["w"] // 2
            cy = p["y"] + p["h"] // 2
            d2 = (cx - bx) ** 2 + (cy - by) ** 2
            if d2 < min_d2:
                min_d2 = d2
                closest_team = p["team"]  # can be TeamA, TeamB, or "Unknown"

        # --- Passes: only count if both are real teams and different
        if (
            self.last_owner_team in self.passes
            and closest_team in self.passes
            and closest_team != self.last_owner_team
        ):
            self.passes[closest_team] += 1

        # --- Possession: accumulate only for valid team (A/B) and stable continuity
        if self.last_owner_team == closest_team and closest_team in self.possession_seconds:
            if self.last_update_time is not None:
                self.possession_seconds[closest_team] += max(0.0, (now_t - self.last_update_time))

        # Update owner if valid (ignore Unknown for owner memory)
        if closest_team in self.passes:
            self.last_owner_team = closest_team

        self.last_update_time = now_t
        return {"team": closest_team}

    def add_goal(self, scoring_team):
        if scoring_team in self.goals:
            self.goals[scoring_team] += 1

    def get_summary(self):
        # Also compute quick possession percent for convenience
        total = self.possession_seconds["TeamA"] + self.possession_seconds["TeamB"]
        if total > 0:
            possession_percent = {
                "TeamA": 100.0 * self.possession_seconds["TeamA"] / total,
                "TeamB": 100.0 * self.possession_seconds["TeamB"] / total,
            }
        else:
            possession_percent = {"TeamA": 0.0, "TeamB": 0.0}

        return {
            "passes": dict(self.passes),
            "possession_seconds": dict(self.possession_seconds),
            "possession_percent": possession_percent,
            "goals": dict(self.goals),
            "current_owner_team": self.last_owner_team,
        }


# ==================== Team color utils ====================
def circ_dist(h1, h2):
    d = abs(int(h1) - int(h2))
    return min(d, 180 - d)

def dominant_hue_from_crop(bgr_crop, sat_min=50, min_pix=25):
    if bgr_crop is None or bgr_crop.size == 0:
        return None
    hsv = cv2.cvtColor(bgr_crop, cv2.COLOR_BGR2HSV)
    H, S, _ = cv2.split(hsv)
    m = S > sat_min
    if m.sum() < min_pix:
        return None
    hist = cv2.calcHist([H[m]], [0], None, [180], [0, 180]).flatten()
    return int(hist.argmax())

def get_torso_crop(frame, box):
    x, y, w, h = box
    Hf, Wf = frame.shape[:2]
    x1 = int(max(0, x + 0.40 * w))
    x2 = int(min(Wf, x + 0.60 * w))
    y1 = int(max(0, y + 0.45 * h))
    y2 = int(min(Hf, y + 0.65 * h))
    if x2 <= x1 or y2 <= y1:
        return None
    return frame[y1:y2, x1:x2]

def bootstrap_team_centroids(all_crops, n_clusters=2, max_iter=100):
    hues = [dominant_hue_from_crop(c) for c in all_crops if c is not None]
    hues = np.array([h for h in hues if h is not None], dtype=np.float32)
    if len(hues) < n_clusters:
        raise ValueError("Not enough valid samples to bootstrap teams")
    rng = np.random.default_rng(0)
    centroids = rng.choice(hues, size=n_clusters, replace=False)
    for _ in range(max_iter):
        dist = np.array([[circ_dist(h, c) for c in centroids] for h in hues])
        labels = np.argmin(dist, axis=1)
        new_centroids = []
        for k in range(n_clusters):
            cluster_hues = hues[labels == k]
            if len(cluster_hues) == 0:
                new_centroids.append(centroids[k])
            else:
                angles = np.deg2rad(cluster_hues * 2)
                mean_angle = np.arctan2(np.mean(np.sin(angles)), np.mean(np.cos(angles)))
                mean_angle_deg = (np.rad2deg(mean_angle) / 2) % 180
                new_centroids.append(mean_angle_deg)
        new_centroids = np.array(new_centroids, dtype=np.float32)
        if np.allclose(new_centroids, centroids):
            break
        centroids = new_centroids
    return float(centroids[0]), float(centroids[1])

def assign_team_only(h, hue_A, hue_B, thr=20):
    # Keep your behavior: may return None (we'll map to "Unknown" for stats)
    if h is None:
        return None
    dA, dB = circ_dist(h, hue_A), circ_dist(h, hue_B)
    if min(dA, dB) > thr:
        return None
    return "TeamA" if dA <= dB else "TeamB"


# ==================== Tiny ball smoothing ====================
recent_ball = deque(maxlen=3)
def smooth_ball(cx, cy, r):
    recent_ball.append((cx, cy, r))
    xs = [p[0] for p in recent_ball]
    ys = [p[1] for p in recent_ball]
    rs = [p[2] for p in recent_ball]
    return int(np.median(xs)), int(np.median(ys)), max(3, int(np.median(rs)))


# ==================== Model & video ====================
model = YOLO("yolov8n.pt")  # single pass, filter classes

video_path = "match2.mp4"  # <- change if needed
cap = cv2.VideoCapture(video_path)
if not cap.isOpened():
    raise SystemExit(f"Cannot open video: {video_path}")

fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
bootstrap_frames = int(20 * fps)

frame_idx = 0
bootstrap_crops = []
hue_A = hue_B = None
first_player_hue = None
bootstrapped = False

# Stats + output
pass_counter = PassCounter()
last_stats_dump = 0.0
stats_interval = 2.0  # seconds

# Visible wall-clock match timer
wall_start = time.time()

# Goal-zone config
goal_zone_frac = 0.12  # left/right 12% of width
goal_cooldown_s = 2.0
last_goal_time = 0.0

while True:
    ok, frame = cap.read()
    if not ok:
        break
    frame_idx += 1
    now_t = frame_idx / fps  # stable timeline for stats

    H, W = frame.shape[:2]
    left_zone_x2 = int(W * goal_zone_frac)
    right_zone_x1 = int(W * (1.0 - goal_zone_frac))

    # One YOLO call for people (0) and ball (32)
    res = model.predict(frame, conf=0.45, device="cpu", verbose=False, classes=[0, 32], max_det=200)

    # Parse detections
    people_xywh = []
    best_ball = None  # (cx, cy, r, conf)

    for r in res:
        if r.boxes is None:
            continue
        cls = r.boxes.cls.cpu().numpy().astype(int)
        conf = r.boxes.conf.cpu().numpy()
        xyxy = r.boxes.xyxy.cpu().numpy().astype(int)

        for c, s, (x1, y1, x2, y2) in zip(cls, conf, xyxy):
            if c == 0:  # person
                w, h = x2 - x1, y2 - y1
                people_xywh.append((x1, y1, w, h))
            elif c == 32:  # sports ball
                cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
                rpx = max((x2 - x1) // 2, (y2 - y1) // 2)
                if best_ball is None or s > best_ball[3]:
                    best_ball = (cx, cy, rpx, s)

    # Players: draw + build list for stats
    players_for_stats = []
    for (x, y, w, h) in people_xywh:
        torso = get_torso_crop(frame, (x, y, w, h))
        if not bootstrapped:
            bootstrap_crops.append(torso)
            if first_player_hue is None:
                first_player_hue = dominant_hue_from_crop(torso)
        else:
            h_dom = dominant_hue_from_crop(torso)
            team = assign_team_only(h_dom, hue_A, hue_B, thr=20)
            draw_team = team if team else "Unknown"
            if team:
                color = (0, 0, 255) if team == "TeamA" else (255, 0, 0)
                cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
                cv2.putText(frame, team, (x, y - 6),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.55, color, 2)
            players_for_stats.append({"team": draw_team, "x": x, "y": y, "w": w, "h": h})

    # Bootstrap once after ~20s
    if not bootstrapped and frame_idx >= bootstrap_frames:
        try:
            c1, c2 = bootstrap_team_centroids(bootstrap_crops)
            if first_player_hue is not None and circ_dist(first_player_hue, c1) < circ_dist(first_player_hue, c2):
                hue_A, hue_B = c1, c2
            else:
                hue_A, hue_B = c2, c1
            bootstrapped = True
            print(f"[BOOTSTRAP DONE] Locked TeamA hue: {hue_A:.2f}, TeamB hue: {hue_B:.2f}")
        except Exception as e:
            print(f"[BOOTSTRAP SKIPPED] {e}")

    # Ball draw (+ smooth)
    ball_xy = None
    if best_ball is not None:
        bx, by, br, _ = best_ball
        bx, by, br = smooth_ball(bx, by, br)
        ball_xy = (bx, by)
        cv2.circle(frame, (bx, by), int(br), (0, 255, 255), 2)
        cv2.putText(frame, "Ball", (bx - 10, by - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 255, 255), 2)

        # --- Goal heuristic ---
        # Right zone => TeamA scores, Left zone => TeamB scores (swap if your footage is reversed)
        now_wall = time.time()
        if now_wall - last_goal_time >= goal_cooldown_s:
            if bx <= left_zone_x2:
                pass_counter.add_goal("TeamB")
                last_goal_time = now_wall
            elif bx >= right_zone_x1:
                pass_counter.add_goal("TeamA")
                last_goal_time = now_wall

    # Update stats (passes/possession) every frame
    evt = pass_counter.update(now_t, ball_xy, players_for_stats)
    if evt is not None:
        tteam = evt["team"]
        if tteam and tteam != "Unknown":
            cv2.putText(frame, f"PASS {tteam}", (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8,
                        (0, 255, 0) if tteam == "TeamA" else (255, 0, 0), 2)

    # Timer overlay (wall clock)
    elapsed = int(time.time() - wall_start)
    mm, ss = divmod(elapsed, 60)
    cv2.putText(frame, f"{mm:02d}:{ss:02d}", (W // 2 - 30, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 2)

    # (Optional) draw goal-zone guides
    cv2.line(frame, (left_zone_x2, 0), (left_zone_x2, H), (0, 200, 0), 1)
    cv2.line(frame, (right_zone_x1, 0), (right_zone_x1, H), (0, 200, 0), 1)

    # Periodically dump stats to JSON
    if (time.time() - last_stats_dump) >= stats_interval:
        with open("stats_latest.json", "w", encoding="utf-8") as f:
            json.dump(pass_counter.get_summary(), f, indent=2)
        last_stats_dump = time.time()

    # Show frame
    cv2.imshow("Players + Ball + Stats + Timer", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Final flush
with open("stats_latest.json", "w", encoding="utf-8") as f:
    json.dump(pass_counter.get_summary(), f, indent=2)

cap.release()
cv2.destroyAllWindows()
print("[DONE] Final stats written to stats_latest.json")
