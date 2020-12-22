import numpy as np
from random import shuffle
from past.builtins import xrange

def softmax_loss_naive(W, X, y, reg):
  """
  Softmax loss function, naive implementation (with loops)

  Inputs have dimension D, there are C classes, and we operate on minibatches
  of N examples.

  Inputs:
  - W: A numpy array of shape (D, C) containing weights.
  - X: A numpy array of shape (N, D) containing a minibatch of data.
  - y: A numpy array of shape (N,) containing training labels; y[i] = c means
    that X[i] has label c, where 0 <= c < C.
  - reg: (float) regularization strength

  Returns a tuple of:
  - loss as single float
  - gradient with respect to weights W; an array of same shape as W
  """
  # Initialize the loss and gradient to zero.
  loss = 0.0
  dW = np.zeros_like(W)

  #############################################################################
  # TODO: Compute the softmax loss and its gradient using explicit loops.     #
  # Store the loss in loss and the gradient in dW. If you are not careful     #
  # here, it is easy to run into numeric instability. Don't forget the        #
  # regularization!                                                           #
  #############################################################################
  

  num_of_train = X.shape[0]
  num_of_class = W.shape[1]

  for i in xrange(num_of_train):
    scores = X[i].dot(W)
    scores = np.exp(scores)
    summation = np.sum(scores)
    correct_class_score = scores[y[i]]
    loss -= np.log(correct_class_score/summation)
    for j in xrange(num_of_class):
      if j == y[i]:
        dW[:, j] += (scores[j]/summation)*X[i] - X[i]
      else:
        dW[:, j] += (scores[j]/summation)*X[i]
  dW /= num_of_train
  loss /= num_of_train
  loss += reg*np.sum(W*W)
  dW += 2*reg*W

  #############################################################################
  #                          END OF YOUR CODE                                 #
  #############################################################################

  return loss, dW


def softmax_loss_vectorized(W, X, y, reg):
  """
  Softmax loss function, vectorized version.

  Inputs and outputs are the same as softmax_loss_naive.
  """
  # Initialize the loss and gradient to zero.
  loss = 0.0
  dW = np.zeros_like(W)

  #############################################################################
  # TODO: Compute the softmax loss and its gradient using no explicit loops.  #
  # Store the loss in loss and the gradient in dW. If you are not careful     #
  # here, it is easy to run into numeric instability. Don't forget the        #
  # regularization!                                                           #
  #############################################################################
  num_of_train = X.shape[0]
  scores = X.dot(W)
  scores = np.exp(scores)
  correct_class_score = scores[range(num_of_train), y]
  summation = np.sum(scores, axis=1)
  temp_loss = -np.log(correct_class_score/summation)
  temp_loss /= num_of_train
  
  loss = np.sum(temp_loss)
  loss += reg*np.sum(W*W)
  
  summation = np.reshape(summation, [num_of_train, 1])
  margin_grad = scores / summation
  margin_grad[np.array(range(num_of_train)), y] -= 1
  dW = (X.T).dot(margin_grad)
  dW /= num_of_train
  dW += 2*reg*W


  
  #############################################################################
  #                          END OF YOUR CODE                                 #
  #############################################################################

  return loss, dW

