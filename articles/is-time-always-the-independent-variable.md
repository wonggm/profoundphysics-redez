---
title: Is Time Always the Independent Variable?
category: mathematics
date: 2024-09-04
original_url: https://profoundphysics.com/is-time-always-the-independent-variable/
excerpt: Not in relativistic mechanics, not in parametrized formulations, and not in optics.
canonical: false
---

# Is Time Always The Independent Variable? (And When Is It Not?)

> Not in relativistic mechanics, not in parametrized formulations, and not in optics.

*Originally published at [profoundphysics.com](https://profoundphysics.com/is-time-always-the-independent-variable/).*

---

Usually time is treated as the independent variable when, for example, making graphs as it is typically thought to not depend on other variables such as position. But, is time really always the independent variable?

**In short, time is not always the independent variable, although in most cases it will be as time usually does not depend on other variables. In relativity, however, time may not always be the independent variable as it can depend on position, velocity and other variables.**

In this article, I’m going to explore these ideas in detail and look at the different sides of this.

## Why Is Time Usually Treated As The Independent Variable?

You’re probably familiar already with the idea of treating time as the independent variable.

For example, when making graphs, we typically **place time on the x-axis** to represent the fact that it is viewed as the independent variable (although sometimes time can be placed on the y-axis too, which I explain in [this article](https://profoundphysics.com/why-is-time-always-on-the-x-axis-of-a-graph/)).

Another example is that quantities are usually expressed in the form of being **functions of time**, such as in the formula for position:

$$x\left(t\right)=x_0+v_0t+\frac{1}{2}at^2$$

This clearly indicates that we usually think of time as something that doesn’t depend on other variables. But why exactly is this the case?

**Time is usually viewed as the independent variable for the simple reason that it doesn’t depend on anything else. Time simply ticks by at the same rate wherever you are **(in non-relativistic context)**, independent of other variables so it doesn’t make sense to express time as a dependent variable.**

Now, of course this isn’t exactly true if we take into account special and general relativity (as I’ll explain soon), but this is the usual way we think of time.

Intuitively, this reasoning seems logical too. I mean think about it. Which makes more sense; **the position of a moving object changing as time moves forward or the time changing as the position changes**?

Of course the first option! Here’s another way to think about it; if you think of the position as a function of time (i.e. time is the independent variable), what happens when the object stops?

Well, the object just stops but **time is still moving forwards since it does not depend on the position in any way**.

Now think about it the other way around; if you view time as a function of position (i.e. time is now the dependent variable and position is the independent one), does time now suddenly stop if the object stops?

Of course not, time would still flow forwards just as it did before. So, in short, **it makes no sense to think of time as being dependent on something else**, such as position (well, in classical Newtonian physics, that is).

## Can Time Be The Dependent Variable (& When)?

Now, the Newtonian picture of time as always being the independent variable isn’t quite true anymore if we take into account relativistic effects. But how exactly does this make time a dependent variable?

**In short, time can sometimes be treated as a dependent variable. For example, in general relativity, time will dilate near a black hole as seen by an outside observer. Thus, the outside observer could describe time as a dependent variable that depends on position (distance from the gravitating object).**

Let me explain this in a bit more detail. You may have heard before that in relativity, time is thought to be *relative* ([this article](https://profoundphysics.com/special-relativity-for-dummies-an-intuitive-introduction/) gives you an understandable but comprehensive introduction to special relativity).

Anyway, the notion of relative time really comes from the fact that observers moving relative to one another would measure time differently since would assign different kinds of coordinate systems to each other because of their relative motion.

Now, in relativity there are generally two types of time dilation; **gravitational time dilation and time dilation due to velocity** (although in more complex phenomena, the two somewhat lose their distinctions).

Time dilation due to velocity occurs when two observers have a relative velocity. Let’s say that observer A would describe his own time as being t0. Then another observer B would describe A’s time by the formula:

$$t=\frac{t_0}{\sqrt{1-\frac{v^2}{c^2}}}$$

Now, what’s the point of all this? The point here is that the time observer B would assign observer A to have is **dependent on the relative velocity between the two observers**.

So, here the time variable t is NOT an independent variable anymore; **it is now a function of velocity** (in other words, a *dependent variable*):

$$t\left(v\right)=\frac{t_0}{\sqrt{1-\frac{v^2}{c^2}}}$$

The same phenomenon occurs with gravitational time dilation also. Say observer A is now in a gravitational potential (for example, near a black hole), then observer B, who is far away from all gravitational effects, would describe A’s time to be given by the formula:

$$t\left(r\right)=\frac{t_0}{\sqrt{1-\frac{2GM}{c^2r}}}$$

The gravitational time dilation phenomenon is really due to the two observers assigning different time coordinates to each other because there is a relative acceleration between them due to gravity (or more technically, the other observer experiences more curvature in the spacetime manifold).

Notice that the time t is now a **dependent variable**; it is dependent on the distance away from the gravitating object (r). In other words, time now becomes a function of position also.

There is, in fact, an even more general formula, which describes the time dilation near a spinning, charged black hole (also called a Kerr-Newman black hole):

$$t\left(r{,}v\right)=t_0\sqrt{\frac{\left(1-\frac{2GM}{c^2r}+\frac{J^2}{M^2c^2r^2}+\frac{Q^2G}{4\pi\varepsilon_0c^4r^2}\right)\left(1+\frac{J^2}{M^2c^2r^2}\right)}{\left(1-\frac{2GM}{c^2r}+\frac{J^2}{M^2c^2r^2}+\frac{Q^2G}{4\pi\varepsilon_0c^4r^2}\right)^2-\frac{v^2}{c^2}\left(1+\frac{J^2}{M^2c^2r^2}\right)^2}}$$

J here is the angular momentum of the spinning black hole and Q is its charge. Notice that t is now dependent on both velocity and position.

Anyway, my point here wasn’t to show what a monstrosity this formula is, it was to show how **time can be treated as a dependent variable also** (namely in the context of relativity).

It’s also always possible to artificially make time a dependent variable, at least mathematically. Here’s an example. Consider the formula for the distance traveled as a function of time under constant acceleration (a):

$$d\left(t\right)=v_0t+\frac{1}{2}at^2$$

If we were to solve this for t, we’d get:

$$t\left(d\right)=\frac{1}{a}\left(\sqrt{v_0^2+2ad}-v_0\right)$$

This formula now gives the time it takes to travel a certain distance d as a function of this distance.

Notice that we’ve now sort of artificially made time **the dependent variable**; it is now a function of the distance traveled. In a mathematical sense, sure, this is a totally valid thing to do.

Of course, physically, this still doesn’t mean that the “flow of time” would somehow be physically dependent on distance – it is simply a mathematical expression that gives the time to travel a certain distance.

In this sense, sure, you could say that time is a dependent variable now, but only because we’ve specified t to be a variable associated with a certain distance, not the universal notion of time we usually think of.

All in all, the point is that time is usually not thought to be dependent on any other variable (apart from relativistic context).

Thus, time is viewed as being an independent variable and also why it’s usually treated as the independent variable in almost all physical contexts, logically so.

[![](assets/images/is-time-always-the-independent-variable/img_2.webp)](https://courses.profoundphysics.com/p/mathematics-of-general-relativity) 

My **Mathematics of General Relativity** -course will teach you all the math you need for a deep understanding of general relativity. You’ll find more information [here](https://courses.profoundphysics.com/p/mathematics-of-general-relativity).

---

*← [Back to the full archive](../index.html)*
