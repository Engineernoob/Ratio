# memory decay model placeholder
import math

def forgetting_curve(t):
    return math.exp(-0.15 * t)