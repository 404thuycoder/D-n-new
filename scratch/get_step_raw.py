import os

log_path = r"C:\Users\ADMIN\.gemini\antigravity\brain\4a932f77-b9de-43b5-bd9a-fe5c714af817\.system_generated\logs\overview.txt"
output_file = r"f:\DU LỊCH\Du-Lich\scratch\step_2560_raw.txt"
target_step = 2560

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        if f'"step_index":{target_step}' in line:
            with open(output_file, 'w', encoding='utf-8') as out:
                out.write(line)
            print(f"Found step {target_step}")
            break
else:
    print(f"Step {target_step} not found.")
