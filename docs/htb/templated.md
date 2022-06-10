# Templated

## Tóm tắt

Đây một bài Blackbox cần quan sát thêm ở các thông tin đưa ra là có thể nhận ra.

Vector attack ở bài này liên quan tới SSTI (sever side template injection) khi cho phép người dùng tùy ý điều khiển ở một số page tưởng như vô hại dẫn đến RCE.

## Walkthrough

Đầu tiên khi bước vào thì website hiển thị duy nhất thông tin về Framework sử dụng.


![screenshot-from-2021-09-03-15-52-17.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1642606674425/7wnGAgkch.png)

Dựa vào tên Framework là `Flask/Jinja2` và tên của Challenge thì tìm đã search được về lỗi hổng SSTI ở framework này. Nhưng mà website này trống, lấy gì để injection đây? Mình thử test thêm URL random xem lấy thêm được thông tin gì không .\_.&#x20;

![screenshot-from-2021-09-03-16-23-29.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1642606695208/gqaoSGvYCas.png)

Ồ, nó sử dụng template để in ra tên page lỗi? Injection thử payload trong [Cheat sheet](https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection#jinja2-python) xem thế nào nhỉ .\_.



![screenshot-from-2021-09-03-15-58-35.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1642606708922/G2J0a4rt-.png)

Đúng như dự đoán, có thể Injection tại đây. Vậy làm như thế nào để RCE đây? Thì các tài liệu liên quan đến lỗ hổng SSTI của Python nhắc đến rất nhiều từ khóa MRO (method resolution order). Mình đọc qua thì cơ bản nó là cách mà Python lookup các attributes khi mà Python cho phép đa kế thừa (multiple inheritance) thì việc các lớp cha có cùng thuộc tính là có thể xảy ra, việc lookup này diễn ra từ dưới lên trên, từ trái qua phải của các lớp kế thừa. Và các lớp này có thể truy cập thông qua phương thức `mro()` hoặc `__mro__` . Từ đây ta có thể gọi các lớp hoặc thuộc tính khác từ đây.

Trở lại với website thì thử với các thuộc tính của một string lớp bình thường xem sao nhé


![screenshot-from-2021-09-03-16-00-14.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1642606722971/kbWdqqDdY.png)
&#x20;Vậy là từ đây có thể gọi đến các thuộc tính của lớp object là cha tất cả lớp khác. Phương thức`subclasses()` có thể gọi ra được tất cả các subclass đó.


![screenshot-from-2021-09-03-16-01-07.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1642606735217/ViE1MlgRS.png)

Ta có ở đây một lô các lớp. Lớp Popen có thể RCE nên lấy đúng vị trí của nó là được =)) Nhưng nhiều thế này đếm đến bao giờ :"< Rất may python có phương thức slice mảng khá hay nên tìm nó cũng không đến mức phải đếm từng cái một.


![screenshot-from-2021-09-03-16-02-21.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1642606747784/13Lwc9Am-.png)

&#x20;Vậy xác định được index của lớp Popen. Rồi tạo một instance rồi lấy data ra thôi. Payload đầy đủ sẽ thế này.

```
"".__class__.__mro__[1].__subclasses__()[414](["cat flat.txt"],shell=True,stdout=-1).communicate()
```

Và lấy flag ra thôi :v&#x20;


![screenshot-from-2021-09-03-16-07-01.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1642606757609/7d7P5wDwI.png)
