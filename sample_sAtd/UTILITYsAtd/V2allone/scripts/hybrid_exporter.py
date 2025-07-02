import os

# 入力ディレクトリ（カレントディレクトリ基準）
ORIGINALS_DIR = os.environ.get('ORIGINALS_DIR', 'originals')
PROTECTED_DIR = os.environ.get('PROTECTED_DIR', 'protected')
OUTPUT_DIR = os.environ.get('OUTPUT_DIR', 'hybrid_output')

# 出力ディレクトリがなければ作成
os.makedirs(OUTPUT_DIR, exist_ok=True)

# originals/protected ディレクトリ内の隠しファイルを除外したファイル一覧取得
original_files = [
    f for f in os.listdir(ORIGINALS_DIR)
    if os.path.isfile(os.path.join(ORIGINALS_DIR, f)) and not f.startswith('.')
]
protected_files = [
    f for f in os.listdir(PROTECTED_DIR)
    if os.path.isfile(os.path.join(PROTECTED_DIR, f)) and not f.startswith('.')
]

# 1つのハイブリッドファイルにまとめる
output_path = os.path.join(OUTPUT_DIR, 'party_hybrid.txt')
with open(output_path, 'w', encoding='utf-8') as out:
    # オリジナル部分
    for orig_file in original_files:
        orig_path = os.path.join(ORIGINALS_DIR, orig_file)
        out.write(f'=== ORIGINAL: {orig_file} ===\n')
        with open(orig_path, 'r', encoding='utf-8', errors='ignore') as orig:
            out.write(orig.read() + '\n')
    # プロテクト部分
    for prot_file in protected_files:
        prot_path = os.path.join(PROTECTED_DIR, prot_file)
        out.write(f'\n=== PROTECTED: {prot_file} ===\n')
        with open(prot_path, 'r', encoding='utf-8', errors='ignore') as prot:
            out.write(prot.read() + '\n')
print(f'出力: {output_path}')
print('ハイブリッドファイル（パーティ用）の作成が完了しました。') 