library(rpart)


# use 200 training set to grow 1000 decision trees
# i.e. 1000th column means predict all 1000 data (each has 20 components)
adaboost <- function(x,y,hold.out.x,m = niter,treedepth = 1){
   tdata <- data.frame(x, y)
   n <- length(y)
   # Initialize the weight
   W <- rep(1/n, n)#w1
   trees <- list()
   eps <- 0
   alpha <- rep(0, m)
   for(M in 1:m){
     #fit m-th model the classifiera
     fit<-rpart(y~., data = tdata, weights=W, method = "class", maxdepth=treedepth)
     trees[[M]] <- fit #fm

     y_hat <- predict(fit, data.frame(x), type="class")
     
     a <- 0
     b <- 0
     for(i in 1:n){
       a = a + W[i]*1*(y_hat[i]!=y[i])
       b = b + W[i]
     }
     eps = a/b
     alpha[M] = log((1-eps)/eps)
     for(i in 1:n){
       W[i] = W[i]*exp(alpha[M]*1*(y_hat[i]!=y[i]))
     }
     
   }
   temp = list(tree = trees, alpha=alpha, m=niter)
   class(temp) = "temp"
   return (temp)
 }


predict.temp <- function(fit_adaboost, hold.out.x){
  trees <- fit_adaboost[[1]]
  alphas <- fit_adaboost[[2]]
  m <- fit_adaboost[[3]]

  tmp <- 0
  pred <- matrix(nrow = 1000, ncol = 1000)
  for(i in 1:m){
    fit <- trees[[i]]
    y_hat <- predict(fit, data.frame( hold.out.x), type="class")
    y_hat = as.numeric(as.character(y_hat))
    tmp = tmp + alphas[i] * y_hat
    pred[,i]  = sign(tmp)

  }
  out = list(prediction = pred)
  return (out)
}



