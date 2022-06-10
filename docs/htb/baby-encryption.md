
# BabyEncryption

## Walkthrough

Đề bài đưa ra một Source code bao gồm hàm bị mật mã hóa (encrypt) và một đoạn thông báo(message) đã bị mật mã hóa. Về cơ bản đoạn mã hóa này chỉ sử dụng toán học và mã hóa (encoding) để sinh ra bản mã(cipher text). &#x20;

```python
def encryption(msg):
    ct = []
    for char in msg:
        ct.append((123 * char + 18) % 256)
    return bytes(ct)
    
...
f.write(ct.hex())
```

Xét về diện toán học thì đây là phép lấy modul của một phép tuyến tính nên chỉ cần biến đổi lại như sau

$$y = (123x + 18) \mod 256$$
$$y \equiv (123x + 18) \pmod{256}$$
$$y - 18 \equiv 123x \pmod{256}$$
$$123^{-1}(y - 18) \equiv x \pmod{256}$$
$$179(y - 18) \equiv x \pmod{256}$$
$$179y + 106 \equiv x \pmod{256}$$


Đây là mã hóa Affine mà mình vừa mới học (nửa môn trong 1 ngày :D)

Và hàm decrypt sẽ đơn giản như sau:

```python
def inverse_decrypt(cipher: bytes):
    msg = ""
    for c in cipher:
        msg += chr((179 * x + 106) % 256)
    return msg
```

Tuy nhiên dưới góc nhìn của một coder(mình chưa chơi ctf crypt bao giờ ^^) thì các _**char**_ được ánh xạ 1-n thành _**cipher**_ nhưng là có thể tìm được kí tự _**cipher**_ nếu coi như nó ánh xạ 1-1 với các kí tự _**char**_ trong bảng mã ascii, và mình chỉ lấy các kí tự `printable` thì ta có cách decrypt sau

P/s: Theo lý thuyết, thì do cái hệ số 123 là khả nghịch (inversable) trong nhóm modular 256 nên nó là ánh xạ 1-1, nên cách giải này luôn đúng =)))&#x20;

```python
def decrypt(msg: bytes):
    
    mapping_table = {}
    for c in string.printable:
        mapping_table[(123 * ord(c) + 18) % 256] = c
    
    msg_dec = ''
    for c in msg:
        if mapping_table[]:
            msg_dec += mapping_table[c]
        else:
            msg_dec += c
    
    return msg_dec
```

Rõ ràng cách dưới nhanh hơn tuy hơi cần điều kiện để nó thỏa mãn toán học một chút nhưng mình nghĩ cách này có vẻ đúng với cách chơi ctf này .\_. Mình mong sau khi chơi ctf về crypt mình sẽ khẳng định được cách này là đúng.
