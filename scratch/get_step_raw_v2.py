import os

log_path = r"C:\Users\ADMIN\.gemini\antigravity\brain\4a932f77-b9de-43b5-bd9a-fe5c714af817\.system_generated\logs\overview.txt"
output_file = r"f:\DU LỊCH\Du-Lich\scratch\step_2560_raw.txt"

f = open(log_path, 'r', encoding='utf-8')
lines = f.readlines()
f.close()

target = '"step_index":2560'
for line in lines:
    if target in line:
        out = open(output_file, 'w', encoding='utf-8')
        out.write(line)
        out.close()
        print("Found")
        break
