"""
Đọc TẤT CẢ user messages trong conversation 4a932f77
"""
import json, os

log_path = r"C:\Users\ADMIN\.gemini\antigravity\brain\4a932f77-b9de-43b5-bd9a-fe5c714af817\.system_generated\logs\overview.txt"

with open(log_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")

for line in lines:
    line = line.strip()
    if not line: continue
    try:
        d = json.loads(line)
        if d.get('source') == 'USER':
            content = d.get('content', '')
            idx = d.get('step_index', 0)
            created = d.get('created_at', '')
            print(f"\n=== Step {idx} [{created}] ===")
            print(content[:500])
    except:
        pass
