def toHex(x):
    a=[hex(b)[2:].zfill(2) for b in x]
    b="#"
    for d in a:
        b+=d
    print(b)
toHex((240,  73, 118))