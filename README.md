This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify


```

import random
import os
import sys
import tempfile
import pygame


def load_image(path, size=None):
    try:
        img = pygame.image.load(path).convert_alpha()
    except Exception:
        # Try converting SVG to PNG if cairosvg is available
        if path.lower().endswith('.svg'):
            try:
                import cairosvg
                tmp = tempfile.NamedTemporaryFile(delete=False, suffix='.png')
                tmp.close()
                cairosvg.svg2png(url=path, write_to=tmp.name)
                img = pygame.image.load(tmp.name).convert_alpha()
                os.unlink(tmp.name)
            except Exception:
                img = None
        else:
            img = None

    if img is None:
        # Create a placeholder surface
        s = pygame.Surface((96, 96), pygame.SRCALPHA)
        s.fill((220, 220, 220, 255))
        return s

    if size is not None:
        img = pygame.transform.smoothscale(img, size)
    return img


def decide_winner(user, computer):
    if user == computer:
        return 'Tie'
    wins = {
        'rock': 'scissors',
        'paper': 'rock',
        'scissors': 'paper'
    }
    if wins[user] == computer:
        return 'User'
    return 'Computer'


def main():
    pygame.init()
    pygame.font.init()
    screen_w, screen_h = 480, 220
    screen = pygame.display.set_mode((screen_w, screen_h))
    pygame.display.set_caption('Rock Paper Scissors - Click an icon')

    icon_size = (96, 96)
    assets = [
        ('rock', 'rock.svg'),
        ('paper', 'paper.svg'),
        ('scissors', 'scissors.svg'),
    ]

    images = []
    for name, path in assets:
        if not os.path.exists(path):
            # try relative to script dir
            base = os.path.dirname(__file__)
            path = os.path.join(base, path)
        images.append((name, load_image(path, icon_size)))

    spacing = 20
    total_w = len(images) * icon_size[0] + (len(images) - 1) * spacing
    start_x = (screen_w - total_w) // 2
    y = 50

    rects = []
    x = start_x
    for name, surf in images:
        rect = pygame.Rect(x, y, icon_size[0], icon_size[1])
        rects.append((name, surf, rect))
        x += icon_size[0] + spacing

    font = pygame.font.SysFont(None, 24)
    result_text = 'Click an icon to play'

    clock = pygame.time.Clock()
    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:
                running = False
            elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                mx, my = event.pos
                for name, surf, rect in rects:
                    if rect.collidepoint(mx, my):
                        user = name
                        computer = random.choice([n for n, _ in images])
                        winner = decide_winner(user, computer)
                        if winner == 'Tie':
                            result_text = f"Tie! Both chose {user}"
                        elif winner == 'User':
                            result_text = f"You win! {user} beats {computer}"
                        else:
                            result_text = f"Computer wins! {computer} beats {user}"
                        print(result_text)

        screen.fill((250, 250, 250))

        # draw icons
        for name, surf, rect in rects:
            screen.blit(surf, rect.topleft)

        # draw outlines
        mx, my = pygame.mouse.get_pos()
        for name, surf, rect in rects:
            color = (180, 180, 180)
            if rect.collidepoint(mx, my):
                color = (30, 144, 255)
            pygame.draw.rect(screen, color, rect, 2)

        # draw text
        txt = font.render(result_text, True, (40, 40, 40))
        screen.blit(txt, (screen_w // 2 - txt.get_width() // 2, 10))

        pygame.display.flip()
        clock.tick(60)

    pygame.quit()


if __name__ == '__main__':
    main()
```
