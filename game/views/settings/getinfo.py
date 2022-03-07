from django.http import JsonResponse
from game.models.player.player import Player
# def getinfo_acapp(request):
#     player = Player.objects.all()[0]
#     return JsonResponse({
#         'result' : 'success',
#         'username' : player.user.username,
#         'photo' : player.photo,
#     })

# def getinfo_web(request):
#     user = request.user
#     if not user.is_authenticated:
#         return JsonResponse({
#             'result': "未登录",
#         })
#     else:
#         player = Player.objects.all()[0]
#         return JsonResponse({
#             'result' : 'success',
#             'username' : player.user.username,
#             'photo' : player.photo,
#         })

def getinfo(request):
    # file = open("/home/zinkt_django/acapp/com")
    # file.write(request)
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({
            'result': "未登录",
        })
    else:
        player = Player.objects.get(user=user)
        return JsonResponse({
            'result' : 'success',
            'username' : player.user.username,
            'photo' : player.photo,
        })