def lfsr(R,mask):
    output = (R << 1) & 0xffffffff
    i=(R&mask)&0xffffffff
    lastbit=0
    while i!=0:
        lastbit^=(i&1)
        i=i>>1
    output^=lastbit
    return (output,lastbit)

mask = '10100100000010000000100010010100'
key  = '00100000111111011110111011111000'
flag = ''

first = True
for i in range(32):
    r=key[:-i-1]
    l='0'+flag
    R=int(l+r, 2)
    (out,lastbit)=lfsr(R, int(mask, 2))
    out = '{:032b}'.format(out)
    if first:

        if out==key[:]:
            flag='0'+flag
        else:
            flag='1'+flag
        first = False

    else:
        if out==flag+key[:-i]:
            flag='0'+flag
        else:
            flag='1'+flag

print (hex(int(flag, 2)))