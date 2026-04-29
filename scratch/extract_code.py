import json
import re
import os

log_path = r"C:\Users\ADMIN\.gemini\antigravity\brain\4a932f77-b9de-43b5-bd9a-fe5c714af817\.system_generated\logs\overview.txt"
output_dir = r"f:\DU LỊCH\Du-Lich\scratch"

steps_to_extract = [2560, 2563, 2566, 2572, 2578, 2581, 2602, 2614, 2620, 2632]

results = {}

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if not line: continue
        try:
            # The log lines are prefixed with '> ' sometimes or just JSON
            if line.startswith('> '):
                line = line[2:]
            
            # Simple check for step_index
            if '"step_index":' in line:
                # Try to parse as JSON. Since it might be partial or have weird stuff, we use regex if json fails
                data = None
                try:
                    data = json.loads(line)
                except:
                    # Fallback to regex for content
                    idx_match = re.search(r'"step_index":(\d+)', line)
                    if idx_match:
                        step_id = int(idx_match.group(1))
                        if step_id in steps_to_extract:
                            # Extract the whole line for manual parsing if needed
                            results[step_id] = line
                
                if data and data.get('step_index') in steps_to_extract:
                    results[data['step_index']] = data

        except Exception as e:
            continue

# Save results to a file for examination
with open(os.path.join(output_dir, 'extracted_steps.json'), 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(results)} steps.")
