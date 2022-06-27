#OBJS specifies which files to compile as part of the project
OBJS = src/backend/main.cpp

#CC specifies which compiler we're using
CC = em++

#COMPILER_FLAGS specifies the additional compilation options we're using
# -w suppresses all warnings
COMPILER_FLAGS = --bind -s NO_FILESYSTEM=1 -s MODULARIZE=1 -s ASSERTIONS=1 -s EXPORT_NAME="MageSim" -O3

#LINKER_FLAGS specifies the libraries we're linking against
LINKER_FLAGS =

#OBJ_NAME specifies the name of our exectuable
OBJ_NAME = dist/js/magesim.js

#This is the target that compiles our executable
all : $(OBJS)
	$(CC) $(OBJS) $(COMPILER_FLAGS) $(LINKER_FLAGS) -o $(OBJ_NAME)