# Python 3.10 asosida rasm
FROM python:3.10

# Ishchi katalogni o‘rnatish
WORKDIR /app

# Tizim paketlarini yangilash va kerakli kutubxonalarni o‘rnatish
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Talab qilinadigan fayllarni konteynerga nusxalash (oldin requirements.txt, keyin kod)
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Loyihani konteynerga nusxalash
COPY . .

# Statik fayllarni yig‘ish va migratsiyani bajarish
RUN python manage.py collectstatic --noinput

# Django serverni ishga tushirish
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
