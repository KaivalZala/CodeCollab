char* buf = (char*)malloc(10);
for (int i = 0; i < 100; i++) {
    buf = (char*)realloc(buf, i * 10); // corruption risk if not null-checked
    strcpy(buf, "data");
}