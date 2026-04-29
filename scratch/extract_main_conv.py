"""
Đọc conversation 4a932f77 - tìm tất cả write_to_file và replace_file_content
Lưu code đầy đủ nhất cho mỗi file
"""
import json, os, re, ast

log_path = r"C:\Users\ADMIN\.gemini\antigravity\brain\4a932f77-b9de-43b5-bd9a-fe5c714af817\.system_generated\logs\overview.txt"
OUT_DIR = r"f:\DU LỊCH\Du-Lich\scratch\extracted_code_v2"
os.makedirs(OUT_DIR, exist_ok=True)

TARGET_FILES = [
    "main.js", "SharedUI.js", "styles.css", "global-tokens.css",
    "index.html", "planner.js", "planner.html", "planner.css",
    "chat-brain.js", "voice-helper.js", "quests.html",
    "leaderboard.html", "my-trips.html", "my-trips-tabs.js",
    "rankUtils.js", "auth.js",
]

def extract_filename(path_str):
    if not path_str:
        return None
    path_str = str(path_str).strip().strip('"\'')
    for tf in TARGET_FILES:
        if tf.lower() in path_str.lower():
            return tf
    return None

def try_decode(s):
    """Cố gắng decode unicode escapes"""
    if not isinstance(s, str):
        return str(s)
    try:
        # Try JSON decode first
        return json.loads(f'"{s}"')
    except:
        pass
    try:
        return s.encode('utf-8').decode('unicode_escape', errors='replace')
    except:
        return s

with open(log_path, 'r', encoding='utf-8') as f:
    content = f.read()
    lines = content.split('\n')

print(f"Total lines: {len(lines)}")

# Track: file -> list of (step_idx, tool_name, content, description)
file_history = {}  # filename -> [(step_idx, content, description)]

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
    
    step_idx = d.get('step_index', 0)
    tool_calls = d.get('tool_calls', [])
    
    for tc in tool_calls:
        tool_name = tc.get('name', '')
        args = tc.get('args', {})
        
        if tool_name == 'write_to_file':
            target = args.get('TargetFile', '')
            code = args.get('CodeContent', '')
            desc = args.get('Description', '')
            fname = extract_filename(target)
            if fname and code:
                decoded = try_decode(code) if isinstance(code, str) else str(code)
                if fname not in file_history:
                    file_history[fname] = []
                file_history[fname].append((step_idx, 'write_to_file', decoded, desc))
                print(f"  WRITE {fname} step={step_idx} len={len(decoded)}")
        
        elif tool_name == 'replace_file_content':
            target = args.get('TargetFile', '')
            rc = args.get('ReplacementContent', '')
            tc_content = args.get('TargetContent', '')
            desc = args.get('Description', '')
            fname = extract_filename(target)
            if fname and rc:
                decoded_rc = try_decode(rc) if isinstance(rc, str) else str(rc)
                decoded_tc = try_decode(tc_content) if isinstance(tc_content, str) else str(tc_content)
                if fname not in file_history:
                    file_history[fname] = []
                file_history[fname].append((step_idx, f'replace:{decoded_tc[:60]}', decoded_rc, desc))
                print(f"  REPLACE {fname} step={step_idx} rc_len={len(decoded_rc)}")
        
        elif tool_name == 'multi_replace_file_content':
            target = args.get('TargetFile', '')
            chunks = args.get('ReplacementChunks', [])
            desc = args.get('Description', '')
            fname = extract_filename(target)
            if fname and chunks:
                if isinstance(chunks, str):
                    try:
                        chunks = json.loads(chunks)
                    except:
                        continue
                if isinstance(chunks, list):
                    for i, chunk in enumerate(chunks):
                        if isinstance(chunk, dict):
                            rc = chunk.get('ReplacementContent', '')
                            tc = chunk.get('TargetContent', '')
                            if rc:
                                decoded_rc = try_decode(rc) if isinstance(rc, str) else str(rc)
                                decoded_tc = try_decode(tc) if isinstance(tc, str) else str(tc)
                                if fname not in file_history:
                                    file_history[fname] = []
                                file_history[fname].append((step_idx, f'multi[{i}]:{decoded_tc[:60]}', decoded_rc, desc))
                                print(f"  MULTI {fname} step={step_idx} chunk={i} rc_len={len(decoded_rc)}")

print(f"\n\nFiles with history: {list(file_history.keys())}")

# Lưu TẤT CẢ history của mỗi file
for fname, history in file_history.items():
    out_path = os.path.join(OUT_DIR, fname + ".history.txt")
    with open(out_path, 'w', encoding='utf-8', errors='replace') as f:
        f.write(f"=== HISTORY for {fname} ===\n")
        f.write(f"Total edits: {len(history)}\n\n")
        for step_idx, tool, content, desc in sorted(history, key=lambda x: x[0]):
            f.write(f"\n{'='*60}\n")
            f.write(f"STEP={step_idx} | TOOL={tool}\n")
            f.write(f"DESC={desc}\n")
            f.write(f"CONTENT:\n{content}\n")
    print(f"  Saved history: {out_path} ({len(history)} edits)")

# Tìm write_to_file lớn nhất (full file content) 
print("\n=== FULL FILE WRITES ===")
for fname, history in file_history.items():
    full_writes = [(s, c, d) for s, t, c, d in history if t == 'write_to_file']
    if full_writes:
        # Lấy cái cuối cùng (mới nhất)
        latest = sorted(full_writes, key=lambda x: x[0])[-1]
        out_path = os.path.join(OUT_DIR, f"FULL_{fname}")
        with open(out_path, 'w', encoding='utf-8', errors='replace') as f:
            f.write(latest[1])
        print(f"  {fname}: step={latest[0]} len={len(latest[1])} -> {out_path}")
