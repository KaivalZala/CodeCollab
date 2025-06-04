a = {}
b = {"a": a}
a["b"] = b
json.dumps(a)  # raises RecursionError