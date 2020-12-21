
sol = open("output.txt", "r+")
fo = open("sol.txt", "w")

str = sol.readlines()
for line in str:
  line.strip('\n')
  print(chr(int(line)))
  fo.write((chr(int(line))).strip('\n'))

 
sol.close()
fo.close()