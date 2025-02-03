from rest_framework.permissions import SAFE_METHODS,BasePermission

# Author and Read only:
class IsAuthorAndReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method == SAFE_METHODS:
            return True
        return obj.author == request.user



# Author and Admin:
class IsAuthorAndIsAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.author == request.user and request.user.is_staff



# Admin or Authenticated or Read only:
class IsAdminOrAuthenticatedOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        return request.user and (request.user.is_authenticated or request.user.is_staff)



# Admin And Read Only:
class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.user and request.user.is_staff:
            return True

        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True

        return False