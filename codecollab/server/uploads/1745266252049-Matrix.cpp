int** matrix = new int*[rows];
for (int i = 0; i < rows; i++)
    matrix[i] = new int[cols];

// incorrect deletion
delete[] matrix;