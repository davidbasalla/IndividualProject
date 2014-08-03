file = open("colortableJET_01.txt", "w")



file.write("#Begin table data:\n")

file.write("0 background 0 0 0 0\n")
for i in range(1,255):

    if i > 128:
        red = (i-128)*2
    else:
        red = 0

    if i > 0 and i <= 20:
       green = 0;
    elif i > 20 and i <= 40:
       green = 40;
    elif i > 40 and i <= 60:
       green = 80;
    elif i > 60 and i <= 80:
       green = 120;
    elif i > 80 and i <= 100:
       green = 160;
    elif i > 100 and i <= 120:
       green = 200;
    elif i > 120 and i <= 140:
        green = 255;
    elif i > 140 and i <= 160:
       green = 200;
    elif i > 160 and i <= 180:
       green = 160;
    elif i > 180 and i <= 200:
       green = 120;
    elif i > 200 and i <= 220:
       green = 80;
    elif i > 220 and i <= 240:
       green = 40;
    elif i > 240 and i <= 255:
       green = 0;

    if i < 128:
        blue = (255-(i+128))*2
    else:
        blue = 0

    file.write(("%s %s %s %s %s %s\n") % (i, 'note' + str(i), red, green, blue, 255))
    




file.write("#EOF")

file.close()
