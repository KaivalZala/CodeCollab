public void updateStock(int id) {
    int current = db.getStock(id);
    db.setStock(id, current - 1);
}