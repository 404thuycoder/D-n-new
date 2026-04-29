"""
Use PIL/Pillow to analyze rank badge images
"""
try:
    from PIL import Image
    import os
    
    imgdir = r"F:\DU LỊCH\Du-Lich\apps\user-web\assets\img"
    rank_files = ['rank_bronze.png', 'rank_silver.png', 'rank_gold.png', 'rank_platinum.png', 'rank_diamond.png']

    def dominant_hue(img, name=""):
        """Get the dominant hue of the icon (ignoring dark pixels)"""
        rgb = img.convert('RGB')
        w, h = rgb.size
        # Sample center 60%
        margin_x, margin_y = w//5, h//5
        counts = {}
        for y in range(margin_y, h-margin_y):
            for x in range(margin_x, w-margin_x):
                r, g, b = rgb.getpixel((x, y))
                brightness = (r + g + b) // 3
                if brightness < 80:
                    continue
                # Quantize 
                key = (r//40*40, g//40*40, b//40*40)
                counts[key] = counts.get(key, 0) + 1
        if not counts:
            return None
        best = max(counts.items(), key=lambda x: x[1])
        return best

    print("=== Individual rank files ===")
    for fname in rank_files:
        path = os.path.join(imgdir, fname)
        img = Image.open(path)
        result = dominant_hue(img, fname)
        print(f"{fname:25s}: dominant color={result[0]}, count={result[1]}")

    print("\n=== Sprite sheet cells ===")
    sprite = Image.open(os.path.join(imgdir, 'rank-sprites.png'))
    W, H = sprite.size
    cell_w, cell_h = W // 6, H // 6
    print(f"Sprite: {W}x{H}, cell: {cell_w}x{cell_h}")
    
    for row in range(6):
        for col in range(6):
            x0, y0 = col * cell_w, row * cell_h
            cell = sprite.crop((x0, y0, x0+cell_w, y0+cell_h))
            result = dominant_hue(cell)
            if result and result[1] > 300:
                r, g, b = result[0]
                count = result[1]
                # Try to name color
                if r > 200 and g > 140 and b < 100:
                    hint = "Bronze/Gold"
                elif r > 200 and g > 160 and b < 80:
                    hint = "Gold"
                elif abs(r-g) < 30 and abs(g-b) < 30 and r > 150:
                    hint = "Silver/neutral"
                elif b > 180 and g > 180 and r < 120:
                    hint = "Cyan/Teal"
                elif b > 180 and r < 100:
                    hint = "Blue"
                elif r > 140 and b > 140 and g < 100:
                    hint = "Purple"
                else:
                    hint = "?"
                print(f"  R{row}C{col}: {result[0]}  count={count}  → {hint}")

except ImportError:
    print("PIL not installed. Trying with simple byte analysis...")
    # Fallback: just compare file hashes
    import hashlib
    import os
    imgdir = r"F:\DU LỊCH\Du-Lich\apps\user-web\assets\img"
    for fname in os.listdir(imgdir):
        if fname.startswith('rank') and fname.endswith('.png'):
            path = os.path.join(imgdir, fname)
            h = hashlib.md5(open(path, 'rb').read()).hexdigest()
            size = os.path.getsize(path)
            print(f"{fname:25s}: md5={h[:12]}, size={size}")
