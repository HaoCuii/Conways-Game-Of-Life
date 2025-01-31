import pygame
import sys

BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
WINDOW_HEIGHT = 800
WINDOW_WIDTH = 800
BLOCK_SIZE = 20

grid = [[0 for x in range(WINDOW_WIDTH // BLOCK_SIZE)] for y in range(WINDOW_HEIGHT // BLOCK_SIZE)]  

def conway(grid, size):
    newGrid = [[0 for x in range(size)] for y in range(size)]
    for y in range(size):
        for x in range(size):
            neighbors = 0
            # Check the 8 neighbors
            for y1 in range(y - 1, y + 2):
                for x1 in range(x - 1, x + 2):
                    if y1 < 0 or y1 >= size or x1 < 0 or x1 >= size:
                        continue
                    if y1 == y and x1 == x:
                        continue
                    neighbors += grid[y1][x1]
            # Conway's Game of Life rules
            if grid[y][x] == 1:
                if neighbors < 2 or neighbors > 3:
                    newGrid[y][x] = 0
                else:
                    newGrid[y][x] = 1
            else:
                if neighbors == 3:
                    newGrid[y][x] = 1
    return newGrid

def main():
    global SCREEN, CLOCK, grid
    pygame.init()
    SCREEN = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
    CLOCK = pygame.time.Clock()
    SCREEN.fill(WHITE)

    while True:
        drawGrid()

        for event in pygame.event.get():
            if event.type == pygame.MOUSEBUTTONDOWN:
                (x, y) = pygame.mouse.get_pos()
                # Toggle the grid cell based on click position
                grid[y // BLOCK_SIZE][x // BLOCK_SIZE] = 1 if grid[y // BLOCK_SIZE][x // BLOCK_SIZE] == 0 else 0

            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

            # Update the grid periodically (every 500ms) or on a key press
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:  # Press spacebar to step forward
                    grid = conway(grid, len(grid))

        pygame.display.update()
        CLOCK.tick(10)  # Limit the frame rate to 10 FPS (for reasonable speed)

def drawGrid():
    for y in range(0, WINDOW_HEIGHT, BLOCK_SIZE):
        for x in range(0, WINDOW_WIDTH, BLOCK_SIZE):
            rect = pygame.Rect(x, y, BLOCK_SIZE, BLOCK_SIZE)

            if grid[y // BLOCK_SIZE][x // BLOCK_SIZE] == 1:
                pygame.draw.rect(SCREEN, BLACK, rect) 

            if grid[y // BLOCK_SIZE][x // BLOCK_SIZE] == 0:
                pygame.draw.rect(SCREEN, WHITE, rect)

            pygame.draw.rect(SCREEN, BLACK, rect, 1)

if __name__ == "__main__":
    main()
