"""
Đọc log conversation 69de8a4a để tìm bước USER nói về giao diện
và lấy ReplacementContent của styles.css, index.html, main.js
"""
import json, os

log_path = r"C:\Users\ADMIN\.gemini\antigravity\brain\69de8a4a-1f64-4b07-a515-d658589841ea\.system_generated\logs\overview.txt"
output_dir = r"f:\DU LỊCH\Du-Lich\scratch"

if not os.path.exists(log_path):
    # Tìm thư mục
    base = r"C:\Users\ADMIN\.gemini\antigravity\brain"
    dirs = os.listdir(base)
    print("Available brain dirs:", dirs[:20])
else:
    with open(log_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    print(f"Total lines: {len(lines)}")
    
    # Tìm user messages
    for line in lines:
        line = line.strip()
        if not line: continue
        try:
            d = json.loads(line)
            if d.get('source') == 'USER':
                print(f"Step {d.get('step_index')}: {d.get('content','')[:300]}")
                print("---")
        except:
            pass
