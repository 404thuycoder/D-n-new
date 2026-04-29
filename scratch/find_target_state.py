"""
Tìm bước mà USER yêu cầu khôi phục giao diện (trước khi sửa "vuong vuc")
và lấy code từ lần replace_file_content gần đó nhất cho styles.css, index.html, main.js
"""
import json, re, os

log_path = r"C:\Users\ADMIN\.gemini\antigravity\brain\4a932f77-b9de-43b5-bd9a-fe5c714af817\.system_generated\logs\overview.txt"
output_dir = r"f:\DU LỊCH\Du-Lich\scratch"

# Đọc toàn bộ file
with open(log_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total log lines: {len(lines)}")

# Tìm các bước USER nói về "khôi phục" hoặc "vuong vuc" hoặc "3h"
user_steps = []
for i, line in enumerate(lines):
    line = line.strip()
    if not line:
        continue
    try:
        d = json.loads(line)
        if d.get('source') == 'USER':
            content = d.get('content', '')
            idx = d.get('step_index', 0)
            if any(kw in content.lower() for kw in ['vuông', 'vuong', 'khôi phục', '3h', 'bảo thay', 'nãy tôi', 'sai lầm', 'phục lại']):
                print(f"  Step {idx}: USER said: {content[:200]}")
                user_steps.append(idx)
    except:
        pass

print(f"\nFound {len(user_steps)} relevant USER steps: {user_steps}")
