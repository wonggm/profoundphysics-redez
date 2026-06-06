---
title: Why Is There a Half in the Kinetic Energy Formula?
category: general-physics
date: 2024-09-06
original_url: https://profoundphysics.com/why-is-there-a-half-in-the-kinetic-energy-formula/
excerpt: The ½mv² falls out of integrating momentum over distance — the work–energy theorem in disguise.
canonical: false
---

# Why Is There a Half In The Kinetic Energy Formula?

> The ½mv$²$ falls out of integrating momentum over distance — the work–energy theorem in disguise.

*Originally published at [profoundphysics.com](https://profoundphysics.com/why-is-there-a-half-in-the-kinetic-energy-formula/).*

---

The usual formula for kinetic energy is ½mv2, which you have most likely seen before. But why exactly is there a half in the formula when there doesn’t seem to be any apparent reason for it?

**In short, the half in kinetic energy comes from a Taylor expansion of the relativistic energy formula since the formula 1/2mv2 is only an approximation of special relativity. The half in kinetic energy can also be explained as an integration factor from the work-energy theorem.**

Even though the half really comes from relativistic approximations, there is also a case to be made for the fact that the half is somewhat arbitrary and does not make any difference in terms of the physics.

In my [introductory article](https://profoundphysics.com/special-relativity-for-dummies-an-intuitive-introduction/) on special relativity, I also explain how ½mv2 is derived from the **relativistic energy formula** using a Taylor series. In the article, you’ll also find more details about some of the concepts we’ll use soon.

## How Does Special Relativity Explain The Kinetic Energy Formula?

The fundamental reason why there is a half in the kinetic energy formula actually comes from [special relativity](https://profoundphysics.com/special-relativity-for-dummies-an-intuitive-introduction/) from a “more complete” version of the kinetic energy formula.

The brief explanation is that this kinetic energy formula of ½mv2 can be considered as an **approximation of special relativity**.

More specifically, classical mechanics as a whole can be considered as a relativistic approximation in the limit that the object or system at hand is moving with a **velocity much slower than the speed of light c**.

This fact makes the regular ½mv2 formula only work in cases where the speed of light is considered “infinite”, i.e. so large compared to v that the relativistic effects do not have to be taken into account.

Anyway, the mathematical way to show this is as follows. First of all, in special relativity there is this thing called the **Lorentz factor**, which has to be used in relativity to account for the fact that the speed of light is always a constant.

The Lorentz factor (denoted by the letter gamma) is defined as:

$$\gamma=\frac{1}{\sqrt{1-\frac{v^2}{c^2}}}$$

Or written in a different way:

$$\gamma=\left(1-\frac{v^2}{c^2}\right)^{-\frac{1}{2}}$$

Here, you can see that there is this one half as the power. In fact, this is exactly where the half in ½mv2 comes from.

Here’s what I mean. Next we will need something called **binomial approximation**, which states that these kinds of things such as the Lorentz factor with one plus something can be approximated as follows (given that epsilon is small):

$$\left(1+\varepsilon\right)^p\approx1+\varepsilon p$$

This, however, only works if epsilon is a really small number (very close to 0), which is where the relativistic approximation comes in. For all values of epsilon, we have to use a Taylor series (which you can read more about [here](https://profoundphysics.com/special-relativity-for-dummies-an-intuitive-introduction/#Relativistic_Energy_(Total_+_Kinetic))).

Now, we can simply apply this approximation to the Lorentz factor given that v is really small compared to c (where epsilon is now -v2/c2 and p is -1/2:

$$\left(1-\frac{v^2}{c^2}\right)^{-\frac{1}{2}}\approx1-\frac{v^2}{c^2}\cdot\left(-\frac{1}{2}\right)=1+\frac{1}{2}\frac{v^2}{c^2}$$

Let’s do a little example to illustrate the point that this approximation works very well for low (classical) velocities.

If we have an object going at, for example, 1% of the speed of light (0.01c, which is still about 3 million meters per second!), the Lorentz factor would give the value (the speed of light being about 3$·$108 m/s):

$$\frac{1}{\sqrt{1-\frac{\left(0.01\cdot3\cdot10^8\right)^2}{\left(3\cdot10^8\right)^2}}}\approx1.000050004$$

And our binomial approximation would give:

$$1+\frac{1}{2}\cdot\frac{\left(0.01\cdot3\cdot10^8\right)^2}{\left(3\cdot10^8\right)^2}\approx1.000050000$$

These values only start to differ at around 9 decimal places, so it’s fair to say that with any velocity even close to regular everyday velocities, this approximation gives an extremely accurate result.

We can now get ½mv2 as an approximation of [relativistic energy](https://profoundphysics.com/special-relativity-for-dummies-an-intuitive-introduction/#Relativistic_Energy_Total_Kinetic), which is given by:

$$E=\gamma mc^2=mc^2\left(1-\frac{v^2}{c^2}\right)^{-\frac{1}{2}}$$

Here, we can just do the binomial approximation to get:

$$E\approx mc^2\left(1+\frac{1}{2}\frac{v^2}{c^2}\right)=mc^2+\frac{1}{2}mv^2$$

And there is the ½mv2 as an approximation from special relativity. Notice that because this is the total energy (not accounting potential energy), there is also this mc2, which is the rest energy.

Now, when v is starting to get closer to c, there has to be additional correction terms to this and this can be done by **expanding the Lorentz factor as a Taylor series** (for how to do this, see [here](https://profoundphysics.com/special-relativity-for-dummies-an-intuitive-introduction/#Relativistic_Energy_(Total_+_Kinetic))), which is a generalization of the binomial approximation.

To be fair, there are also ways to derive the kinetic energy formula and explain where the half comes from by just using classical mechanics, but these aren’t as fundamental as the relativistic approximation method.

Down below, you’ll find four different ways to do it by simply using **Newton’s laws** and basic **kinematics equations**.

## Is The Half In Kinetic Energy Actually Important? Here’s Why It’s Not

Especially in more advanced physics, when analyzing the equations of motion for a system, there is this idea that generally, equations and formulas can be multiplied by arbitrary numbers without changing any of their physical properties.

This is true, because a number (scalar) will only scale the quantity by some amount, but not change anything meaningful about the physics itself.

If we look at the kinetic energy formula from this perspective, **the half is simply an arbitrary coefficient that does not change any of the properties of kinetic energy**.

Some of the main properties that really define the idea of “kinetic energy” are:

- **Kinetic energy should depend on the motion of an object** (i.e. velocity).
- **Kinetic energy should be a scalar** (i.e. it shouldn’t have a specific direction in space).
- **Kinetic energy should increase quadratically rather than linearly with velocity** (it needs to have a v2 in it).

Now, multiplying the whole thing by a half changes none of these characteristics and thus it doesn’t make any difference.

Also, if we really did not want the half there, we could just define our units of mass in a way that would make the half sort of “get absorbed” in the mass m (which is also simply a number), thus making the formula mv2.

Now, you may be wondering that if the half is really just an arbitrary number and doesn’t change anything, what is the reason to even have it there in the first place?

Earlier we saw how the half really came as a result of a **relativistic approximation**, but is it really useful to actually *define* kinetic energy that way? Couldn’t we just define kinetic energy as mv2?

There is actually an argument for keeping this factor of a half in the kinetic energy formula, which is that it simply makes many equations much simpler in more high-level physics as **the half will cancel out when taking derivatives**.

Here are is an example of what I mean. Let’s consider the Lagrangian for a simple, free particle system travelling in, say the x-direction:

$$L=\frac{1}{2}m\dot{x}^2$$

Here the x with a dot above it is simply the time derivative of the position (i.e. velocity v) and this Lagrangian is pretty much just the kinetic energy.

Then, if we wish to calculate the conjugate momentum associated with the x-direction of velocity for this system, it would go like this:

$$p_x=\frac{\partial L}{\partial\dot{x}}\\=\frac{\partial}{\partial\dot{x}}\left(\frac{1}{2}m\dot{x}^2\right)\\=\frac{1}{2}m\frac{\partial}{\partial\dot{x}}\left(\dot{x}^2\right)\\=\frac{1}{2}m\cdot2\dot{x}\\=m\dot x$$

Here it is clear that the ½ cancels out nicely with the 2 that comes down when taking a derivative. If the half was not there, the result would have been $2m\dot{x}$ (also, if this example was confusing, consider checking out this [introduction to Lagrangian mechanics](https://profoundphysics.com/lagrangian-mechanics-for-beginners/)).

Now, imagine if the Lagrangian was much more complicated. Then it would be pretty annoying to keep track of all of these factors of 2, which is why it is very useful to have the half in there for the simple reason that it will just go away when taking a derivative.

In fact, this half is not just exclusive to the kinetic energy formula. **Having an arbitrary one half in formulas is actually a fairly usual convention in physics**. The cancellation of this one half is precisely the reason for this convention.

Generally, there is a clear pattern that **whenever there is a squared quantity, it will be combined with a factor of one half**. Kinetic energy is just one example of this.

Another example is the potential energy for a spring, ½kx2. The general definition of a [conservative force](https://profoundphysics.com/conservative-and-non-conservative-forces-what-are-the-differences/) is:

$$F=-\frac{d}{dx}V\left(x\right)$$

Here V(x) is any potential energy dependent on the position (x). Then, inserting the spring potential energy we get:

$$F=-\frac{d}{dx}\left(\frac{1}{2}kx^2\right)\\=-\frac{1}{2}k\frac{d}{dx}\left(x^2\right)\\=-\frac{1}{2}k\cdot2x\\=-kx$$

This is just the usual formula for a spring force that you might have seen before. Again, there is a nice cancellation taking place because of this factor of a half.

To be fair though, there are also mathematical ways to show where this one half comes from, but it is still useful to keep in mind that it is quite arbitrary and only really there because it simplifies equations in a nice way.

---

*← [Back to the full archive](../index.html)*
