"""
Trích xuất ReplacementContent từ các conversation logs để tìm code tính năng:
- Phân hạng (ranking)
- Tìm kiếm hình ảnh (visual search)  
- Chatbot + history
- Username unicode fix
- Toolbar cleanup
"""
import json, os, re

# Các conversation cần đọc (theo thứ tự thời gian)
CONV_IDS = [
    "9a23bb3e-cd77-44d0-9690-19ddb016a75a",  # Implementing User Ranking
    "9aeec724-34a1-407f-af45-2b444ae649f6",  # Restoring AI API / Refining UI
    "ca0afc45-536f-47a2-9fa3-29d7e175219b",  # Restoring Gamification
    "69de8a4a-1f64-4b07-a515-d658589841ea",  # Restoring Planner
]

BASE = r"C:\Users\ADMIN\.gemini\antigravity\brain"
OUT_DIR = r"f:\DU LỊCH\Du-Lich\scratch\extracted_code"
os.makedirs(OUT_DIR, exist_ok=True)

# Các file cần lấy
TARGET_FILES = [
    "main.js",
    "SharedUI.js", 
    "styles.css",
    "global-tokens.css",
    "index.html",
    "planner.js",
    "planner.html",
    "planner.css",
    "chat-brain.js",
    "voice-helper.js",
    "quests.html",
    "leaderboard.html",
    "my-trips.html",
    "my-trips-tabs.js",
]

# Lưu code cuối cùng tìm thấy cho mỗi file
latest_code = {}  # filename -> (conv_id, step_idx, content)
write_to_file_latest = {}  # filename -> content (from write_to_file tool)

def extract_filename(path_str):
    """Lấy tên file từ đường dẫn"""
    if not path_str:
        return None
    # Normalize
    path_str = path_str.strip().strip('"').strip("'")
    for tf in TARGET_FILES:
        if tf.lower() in path_str.lower():
            return tf
    return None

total_steps = 0
for conv_id in CONV_IDS:
    log_path = os.path.join(BASE, conv_id, ".system_generated", "logs", "overview.txt")
    if not os.path.exists(log_path):
        print(f"  [SKIP] {conv_id} - no log")
        continue
    
    with open(log_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    print(f"\n=== {conv_id} ({len(lines)} lines) ===")
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        try:
            d = json.loads(line)
        except:
            continue
        
        if d.get('source') != 'MODEL':
            continue
        
        tool_calls = d.get('tool_calls', [])
        step_idx = d.get('step_index', 0)
        
        for tc in tool_calls:
            tool_name = tc.get('name', '')
            args = tc.get('args', {})
            
            # write_to_file tool
            if tool_name == 'write_to_file':
                target_file = args.get('TargetFile', '')
                code_content = args.get('CodeContent', '')
                fname = extract_filename(target_file)
                if fname and code_content and len(code_content) > 100:
                    # Unescape
                    try:
                        if isinstance(code_content, str):
                            code_content = code_content.strip('"')
                            code_content = bytes(code_content, 'utf-8').decode('unicode_escape', errors='replace')
                    except:
                        pass
                    write_to_file_latest[fname] = (conv_id, step_idx, code_content)
                    print(f"  [write_to_file] {fname} step={step_idx} len={len(code_content)}")
            
            # replace_file_content / multi_replace_file_content
            elif tool_name in ('replace_file_content', 'multi_replace_file_content'):
                target_file = args.get('TargetFile', '')
                fname = extract_filename(target_file)
                if not fname:
                    continue
                
                if tool_name == 'replace_file_content':
                    rc = args.get('ReplacementContent', '')
                    if rc and len(rc) > 50:
                        if fname not in latest_code or step_idx > latest_code[fname][1]:
                            latest_code[fname] = (conv_id, step_idx, rc)
                            print(f"  [replace] {fname} step={step_idx} len={len(rc)}")
                else:
                    chunks = args.get('ReplacementChunks', [])
                    if isinstance(chunks, str):
                        try:
                            chunks = json.loads(chunks)
                        except:
                            chunks = []
                    for chunk in chunks:
                        rc = chunk.get('ReplacementContent', '')
                        if rc and len(rc) > 50:
                            key = fname
                            if key not in latest_code or step_idx > latest_code[key][1]:
                                latest_code[key] = (conv_id, step_idx, rc)
                                print(f"  [multi_replace] {fname} step={step_idx} len={len(rc)}")
        
        total_steps += 1

print(f"\n\nTotal steps processed: {total_steps}")
print(f"\nwrite_to_file files found: {list(write_to_file_latest.keys())}")
print(f"replace files found: {list(latest_code.keys())}")

# Lưu ra file
for fname, (conv_id, step_idx, content) in write_to_file_latest.items():
    out_path = os.path.join(OUT_DIR, f"FULL_{fname}")
    with open(out_path, 'w', encoding='utf-8', errors='replace') as f:
        f.write(f"// SOURCE: conv={conv_id} step={step_idx}\n")
        f.write(content)
    print(f"  SAVED FULL: {out_path}")

for fname, (conv_id, step_idx, content) in latest_code.items():
    if fname not in write_to_file_latest:  # Ưu tiên write_to_file
        out_path = os.path.join(OUT_DIR, f"PATCH_{fname}")
        with open(out_path, 'w', encoding='utf-8', errors='replace') as f:
            f.write(f"// SOURCE: conv={conv_id} step={step_idx}\n")
            f.write(content)
        print(f"  SAVED PATCH: {out_path}")
