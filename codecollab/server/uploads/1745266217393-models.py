class Author(models.Model):
    profile = models.OneToOneField('Profile', on_delete=models.CASCADE)

class Profile(models.Model):
    author = models.OneToOneField('Author', on_delete=models.CASCADE)