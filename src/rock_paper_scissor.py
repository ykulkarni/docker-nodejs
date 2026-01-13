import pygame
import random
import sys

pygame.init()

#the screen stuff
WIDTH, HEIGHT = 800, 400
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption ("Rock, Paper, Scissor")

#color
WHITE = (255,255,255)
BLACK = (0,0,0)

#font
font=pygame.font.SysFont(None, 48)

#the images
##rock_img = pygame.image.load("images/rock.png")
##paper_img = pygame.image.load("images/paper.png")
##scissor_img = pygame.image.load("images/scissors.png")


#the size of image
##rock_img = pygame.transform.scale(rock_img, (150, 150))
##paper_img = pygame.transform.scale(paper_img, (150, 150))
##scissor_img = pygame.transform.scale(scissor_img, (150, 150))
##
##images = {
##    "rock": rock_img,
##    "paper": paper_img,
##    "scissor": scissor_img
##}


choices = ["rock" , "paper" , "scissor"]

user_choice = None
computer_choice = None
result_text = "ERROR"


#the main loop
##running = True
##while running:
##    screen.fill(WHITE)
##
###instructions
instructions = font.render("press A = Rock | B = Paper | C = Scissor", True, BLACK)
screen.blit(instructions, (50,20))
##
##for event in pyagme.event.get():
##    if event.type == pygame.QUIT:
##        running = False
##
##    if event.type == pygame.KEYDOWN:
##        if event.key == pygame.K_a:
##            user_choice = "rock"
##        elif event.key == pygame.K_b:
##            user_choice = "paper"
##        elif event.key == pygame.K_c:
##            user_choice = "scissor"
##
##    if user_choice:
##        computer_choice = random.choice(choices)
##        result_text = get_result(user_choice, computer_choice)
##
###draw images
##    if user_choice:
##        screen.blit(images[user_choice], (150,150))
##        user_label = font.render ("You", True, BLACK)
##        screen.blit(user_label, (180, 120))
##
##    if computer_choice:
##        screen.blit(images[computer_choice], (500,150))
##        comp_label = font.render("computer" , True, BLACK)
##        screen.blit(comp_label, (500,120))
##
###the result text
##    if result_text:
##        result_surface = font.render(result_text, True, BLACK)
##        screen.blit(result_surface, (300,330))
##
##    pygame.display.flip()
##
##
##pyagme.quit()
##sys.exit()

        
#choose the winner
def get_result(user, computer):
    if user == computer:
        return "It's a tie"
    elif (
        (user == "rock" and computer == "scissor") or
        (user == "paper" and computer == "rock") or
        (user == "scissors" and computer == "paper")
    ):
        return "you won"

    else:
        return "you lost"
     





















            
