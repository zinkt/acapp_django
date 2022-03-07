# django

acapp目录下：```python3 manage.py ...```

# nginx

```
sudo /etc/init.d/nginx start
sudo nginx -s reload
sudo /etc/init.d/nginx stop
```

# uwsgi

```
uwsgi --ini scripts/uwsgi.ini
uwsgi --reload scripts/uwsgi.pid
uwsgi --stop scripts/uwsgi.pid
```
其中，uwsgi.ini配置了服务的启动，并配置了保存服务主进程id的文件uwsgi.pid的位置，在reload，stop时都需要用到

# redis

以默认配置启动  
```sudo redis-server /etc/redis/redis.conf```