#!/usr/bin/env python3
"""
Map non-design-system tokens in style.css to actual design-system tokens.
Then rewrite style.css with all mappings applied.
"""
import re

MAPPINGS = {
    # Color tokens — semantic mappings
    '--color-background':    '--color-surface',
    '--color-surface-100':   '--color-neutral-50',
    '--color-surface-150':   '--color-neutral-100',
    '--color-surface-200':   '--color-neutral-200',
    '--color-surface-300':   '--color-neutral-300',
    '--color-text-primary':  '--color-text',
    '--color-text-secondary': '--color-text-muted',
    # Container max — inline value or reuse a token
    # (no --container-max in design-system, we'll use inline 1200px)
    # Typography — size mappings
    '--font-size-xs':    '--text-xs',
    '--font-size-sm':    '--text-sm',
    '--font-size-base':  '--text-base',
    '--font-size-lg':    '--text-lg',
    '--font-size-xl':    '--text-xl',
    '--font-size-2xl':   '--text-2xl',
    '--font-size-3xl':   '--text-3xl',
    # Typography — weight mappings
    '--font-weight-normal':    '--font-normal',
    '--font-weight-medium':    '--font-medium',
    '--font-weight-semibold':  '--font-semibold',
    '--font-weight-bold':      '--font-bold',
}

def fix_file(path):
    with open(path, 'r') as f:
        content = f.read()
    
    # Replace var(--old) with var(--new)
    count = 0
    for old, new in MAPPINGS.items():
        pattern = re.escape(old)
        matches = len(re.findall(pattern, content))
        if matches > 0:
            content = content.replace(old, new)
            count += matches
    
    # Handle --container-max: replace with 1200px (or use a token)
    content = content.replace('--container-max', '1200px')
    
    with open(path, 'w') as f:
        f.write(content)
    
    print(f"Applied {count} token replacements + container-max fixes in {path}")

fix_file('/srv/svarkor/builds/sea-view-hotel/static/css/style.css')

# Verify no missing tokens remain
with open('/srv/svarkor/builds/sea-view-hotel/static/css/design-system.css', 'r') as f:
    ds_css = f.read()
with open('/srv/svarkor/builds/sea-view-hotel/static/css/style.css', 'r') as f:
    style_css = f.read()

ds_tokens = set(re.findall(r'(--[a-zA-Z0-9_-]+)', ds_css))
style_var_refs = set(re.findall(r'var\((--[a-zA-Z0-9_-]+)\)', style_css))
still_missing = style_var_refs - ds_tokens

if still_missing:
    print(f"\nSTILL MISSING ({len(still_missing)}):")
    for t in sorted(still_missing):
        print(f"  {t}")
else:
    print("\n✓ All tokens now map to design-system tokens!")
