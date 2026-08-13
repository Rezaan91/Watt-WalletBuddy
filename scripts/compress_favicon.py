from pathlib import Path
from PIL import Image

source = Path('/home/ubuntu/wattwallet/assets/images/favicon.png')
image = Image.open(source).convert('RGB')
image.thumbnail((256, 256), Image.Resampling.LANCZOS)
image.save(source, format='PNG', optimize=True, compress_level=9)
