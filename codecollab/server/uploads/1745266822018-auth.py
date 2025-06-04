def login(user, pwd):
    query = f"SELECT * FROM users WHERE username='{user}' AND password='{pwd}'"
    cursor.execute(query)