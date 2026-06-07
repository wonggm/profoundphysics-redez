---
title: Physics Study Tips
category: mathematics
date: 2024-09-03
original_url: https://profoundphysics.com/physics-study-tips/
excerpt: What actually works when you're learning physics on your own — and what is wasted effort.
canonical: false
---

# Physics Study Tips: 9 Unconventional & Practical Hacks

> What actually works when you're learning physics on your own — and what is wasted effort.

*Originally published at [profoundphysics.com](https://profoundphysics.com/physics-study-tips/).*

---

Studying physics is not easy. However, it’s not as difficult either as it’s commonly made out to be if you do the right things.

In this article, I’m going to share with you my **absolute best tips** I’ve learned over the time I’ve been studying physics myself.

Now, why should you read this article and listen to me? Well, I’ve personally used and figured out the benefits of all of these tips out by myself over the years I’ve been self-studying physics.

I’ve used these tips for learning the basic concepts of Newton’s laws as well as for learning way more advanced topics such as general relativity.

Now that I’m actually getting a university degree, I’ve realized how valuable my learnings from self-studying physics have been towards actually studying for classes.

That’s what these tips will be all about and they will benefit both **students** as well as **those on their self-studying journey**!

## Focus On Principles, Not Details

The most common approach in teaching things is to simply memorize as much as possible. This is especially common in, for example, high school physics classes (not necessarily so much in university anymore).

The approach many teachers have is to just make you memorize a bunch of different formulas and exact steps on how to use those.

However, once you realize that all those formulas are actually just consequences of a few *underlying principles*, **you’ll never have to memorize a single formula anymore**.

This is where the idea of focusing on principles rather than some small details comes in.

Now, this may seem like common knowledge since, of course, you want to understand underlying principles instead of memorizing a bunch of details. You may not, however, realize just how many things are actually just results of a single overarching principle.

You’ll find a practical example of this down below to hopefully grasp what I mean better.

Practical Example: Kinematic Formulas

The example that really illustrates the value of simply understanding the basic principles instead of memorizing small “details” are the basic kinematic equations that most high school students learn in their physics classes.

For reference, the four equations I’m talking about are:

$$v=v_0+at\ \ \ \ \left(1\right)$$

$$x=x_0+v_0t+\frac{1}{2}at^2\ \ \ \left(2\right)$$

$$\Delta x=\frac{v+v_0}{2}t\ \ \ \ \left(3\right)$$

$$v^2=v_0^2+2a\Delta x\ \ \ \ \left(4\right)$$

The common “principle” behind all of these is **constant acceleration** (the a here is just some constant number, the acceleration) as these equations are only valid for the case when the acceleration does not change over time.

What this means is that we can derive ALL of these equations by simply knowing the fact that the acceleration is constant. Therefore, we do not have to memorize all of these as they are extremely simple to derive.

In terms of how we can use the fact that the acceleration is a constant, the situation is quite simple; we use the “calculus definition” of acceleration as the second derivative of position:

$$\frac{d^2x}{dt^2}=a$$

As a sidenote; if you’re not familiar with calculus-based physics, I’d highly recommend my **[Advanced Math For Physics -course](https://courses.profoundphysics.com/p/advanced-math-for-physics-a-complete-self-study-course)** (link to the course page). The course covers most of the early university-level mechanics in a way that would easily be understood even at a high-school level.

Now, we can integrate both sides of the equation, since a is just a constant (this would not be possible if a was changing over time), to get:

$$\frac{dx}{dt}=v_0+at$$

The constant of integration we get here is the initial velocity, v0. This can be easily proven by setting t=0 and seeing what you get as a result.

We know, also from calculus, that dx/dt is the velocity, so this is simply $v=v_0+at$.

This, of course, is just our kinematic equation (1). To get the second one, we simply integrate the equation for dx/dt again with respect to time and get:

$$x=x_0+v_0t+\frac{1}{2}at^2$$

This is equation (2). Now, let’s use equation (1) to solve for the acceleration a:

$$v=v_0+at\ \ \Rightarrow\ \ a=\frac{v-v_0}{t}$$

We can insert this into equation (2) to get:

$$\Delta x=v_0t+\frac{1}{2}at^2=v_0t+\frac{1}{2}\frac{v-v_0}{t}t^2=v_0t+\frac{1}{2}vt-\frac{1}{2}v_0t=\frac{v+v_0}{2}t$$

This, as you can see, is out kinematic equation (3).

Now, the fourth equation can be most easily obtained from the work-energy principle, which states the following:

$$\frac{1}{2}m\Delta v^2=\int_{x_1}^{x_2}Fdx$$

On the left-hand side, we have the change in kinetic energy 1/2mv2. On the right, we have the definition of work as the integral of force over distance (this is the “calculus definition” of work). The work-energy principle simply states that the change in kinetic energy is equal to the work done by the force acting on the system.

We know that Δv2 is just v2-v02 (the change in the square of the velocity, where v is the final velocity and v0 is the initial velocity) and that our force is just F=ma (just a constant since a is constant). Inserting these and integrating, we get:

$$\frac{1}{2}m\Delta v^2=\int_{x_1}^{x_2}Fdx\ \ \Rightarrow\ \ \frac{1}{2}m\left(v^2-v_0^2\right)=ma\left(x_2-x_1\right)$$

We know that x2-x1=Δx, so inserting this and solving for v2, we get:

$$\frac{1}{2}m\left(v^2-v_0^2\right)=ma\left(x_2-x_1\right)\ \ \Rightarrow\ \ v^2=v_0^2+2a\Delta x$$

Notice that the mass m cancels out here on both sides.

This is simply our kinematic equation (4). We’ve now derived all four of the basic kinematic equations very quickly.

The point of all of this was that you really do not have to memorize all of these unimportant details about these kinematic equations. All you have to know is that these all come from the fact that the acceleration is constant and can be derived easily from simply knowing this fact (and the work-energy principle).

## Try To Understand Ideas That Are Above Your Level Of Knowledge

If something in the example earlier seemed unfamiliar or confusing to you, don’t worry; you’ve just been exposed to exactly what this tip is going to be!

If you’re at the point of learning what the kinematic equations are in high school, for example, it doesn’t hurt to expose yourself to a little bit of calculus and see where those equations come from. In fact, I think you’ll certainly get some valuable insights from that.

The larger point here is that **by trying to understand ideas that are beyond your knowledge level is going to deepen your understanding of the “easier” topics also**.

As an example, when I was in the beginning of learning physics, I got really interested in learning an area of mechanics called Lagrangian mechanics, which is a bit more advanced than the typical Newtonian mechanics.

When I dove deeper into Lagrangian mechanics (though I definitely didn’t understand everything at first), I learned some extremely interesting insights about energy, conservation laws and things of that sort that really helped me understand Newton’s laws in a completely new light and in a much deeper way.

By the way, I’ve got an entire [introductory article on Lagrangian mechanics](https://profoundphysics.com/lagrangian-mechanics-for-beginners/) that covers all the basics of the topic.

The point is that you never know what you could learn from looking into a topic that is above your knowledge currently.

Now, I was a little reluctant to include this tip at first because some people could take it the wrong way, but I’ll include it anyway.

**I’m not telling you to go study tensor calculus for general relativity before you even know the rules for vector addition**. All I’m saying is go see what’s out there. What are the biggest theories and areas of research in physics? What kinds of concepts are they based on?

Now, I’m not recommending anyone to necessarily rush on learning the coolest and most advanced theories there are like relativity and quantum field theory, but there is something to be said about trying to understand a challenging concept.

**Learning physics is itself a learnable skill** and once you can figure out the strategies through which you personally learn best, everything just comes way easier.

So, if you can learn at least a little bit about something you’re not familiar with beforehand, something that you have to *really* challenge yourself to understand, it will definitely help you to learn the easier things much quicker as well.

Also, there are lots of resources out there that focus on more **intuitive explanations of difficult ideas** (such as some articles on this website).

These, of course, won’t give you a full understanding, but it will help you to see the bigger picture of what physics is really all about and how each theory relates to one another.

**Resource Recommendation**  
  
In my opinion, to truly understand **advanced physics**, beyond what most people will, first requires having a sufficient understanding of **advanced mathematics** – understanding topics like **vector calculus** and **calculus of variations** as these are used in virtually every area of modern physics you’ll ever come across.  
  
This is why I created my own online course **[Advanced Math For Physics](https://profoundphysicscourses.com/advanced-math/)** (link to the course), which aims to give you all the **fundamental tools** you need to understand topics such as **Lagrangian mechanics, electrodynamics or relativity**. Inside the course, you’ll get to discover how all the mathematical tools you learn are directly applied to physics through **solved step-by-step examples** as well as through with tons of **practice problems** with solutions.

## Use The Internet To Your Advantage

I can’t even begin to tell you how many times I’ve been trying to figure something out, some tiny little detail that I just couldn’t quite wrap my head around and **after Googling that exact question**, 9 times out of 10 I’ll find some useful explanation somewhere (though sometimes it requires a little bit of digging).

There are many useful sites on the web (one example being [Physics Stack Exchange](https://physics.stackexchange.com/)), where you’ll find forum-type answers to specific questions.

**Chances are, if you have a question you’re confused about, some else will have that question as well**. So, it’s worth giving the question a quick Google search, for example.

This “strategy” is a bit of a hit or miss sometimes. You’ll sometimes come across some extremely useful answers but other times, you’ll find some basic, mostly useless or simply inaccurate information. So, always use your brain to think critically about what you find on the internet!

The thing that really amazes me is that especially students, mostly high school students, **aren’t really taught to use the internet in this way** (which, I suppose is because the internet does have a lot of misinformation as well).

Most students are limited to their course textbooks (and their teacher’s explanations), but I would suggest to also look at resources on the internet.

Often, you’ll find **something useful for completely free** and it also never hurts to get other viewpoints and explanations of topics in addition to your class lessons.

## Find The Best Resources For You

This tip is closely related to the previous one. What I’d suggest here is that you specifically find **what kinds of resources best suit you** (what format, what type of explanations etc.).

Some people learn best from listening or visually seeing to explanations of topics. For these people, **a class lesson, an online course or even just a Youtube video** might be the best type of resource to learn from.

Others learn better from reading by themselves, so for these people, **a simple textbook** may be best.

I would suggest you **combine different styles of resources**; watch Youtube videos, read textbooks, do practice problems and so on. You’ll naturally find out from this what you prefer best.

It’s important that, in addition to finding the resource format you like, you also find out what **style of explanations** you prefer and learn best from (intuitive, visual, mathematically rigorous etc.).

The best way to find this out is to, well, try out multiple resources, specifically resources from **different authors and creators**. For example, try out a couple different textbooks and see which ones you prefer.

## Always Try To Understand The Intuition Behind Every Concept

There is something to be said about prioritizing **intuitive understanding in physics**.

My experience is that if you understand a topic on a deep, intuitive level, you will be in a very good position to also learn it in a more “technical” or mathematical way.

When it comes to pretty much all areas of physics, **no matter how complicated a topic is, it can always be boiled down to a set of principles that can be understood in an intuitive sense**.

So, the strategy I personally use when learning almost any new topic is that I focus on understanding the intuitive principles and key concepts behind the topic first (this can often be done with little to no mathematics as well).

After this, I then look into gaining a deeper understanding from learning the mathematics and technical details associated with that particular topic.

## Learn To Derive Every Equation Yourself

Some equations in physics are mostly based on observations or experimental evidence. These are usually not derived from anywhere, they are simply constructed based on the idea that they work right and give correct results.

However, many equations are derived as results of some underlying principle and what I would recommend is that **every time you come across a new equation, learn where it comes from and how to derive it**.

The benefits of this are:

- **You’ll develop a deeper understanding of the underlying principle behind the equation**.
- **You’ll practice the skill of actually applying the principle in practice to derive the equation as a result**.
- **You’ll get an understanding of the assumptions and the concepts needed to derive the particular equation**.

It’s worth stating that in some cases, the derivation of a particular equation may require much more advanced math than the level you currently have.

However, even in these cases, you’d likely be able gain some valuable insights by simply just figuring out where the equation comes from and what principles it’s based on, rather than actually deriving it completely.

## Try To Relate Different Topics and Ideas Together

In physics, most topics are related together in some way. Therefore, **to best learn a new topic, try to figure out how it relates to concepts you already know**.

This idea is extremely powerful as it allows for **making useful *analogies* between different concepts**. This then allows you to easily build an intuitive understanding of a concept simply based on the knowledge you already have.

Personally, this has worked wonders for me when learning general relativity.

Pretty much the whole mathematical and geometrical framework of general relativity is based on generalizing ordinary, simple geometric ideas to “curved” spaces.

This allows for a lot of things in general relativity to be understood intuitively by simply thinking of the “ordinary” geometric analogue of a particular concept.

As an example, the way I first learned what a line element of a metric tensor is was to just make an analogy between this and the Pythagorean theorem.

This made it clear that the line element simply describes the “square of the distance” in a particular curved space described by some metric, similarly to how the Pythagorean theorem is used to calculate the “square of the distance” in usual Cartesian coordinates.

Also, when it comes to the notion of making connections between different topics and areas of physics, **you’ll sometimes come across ideas that are very ubiquituos** (i.e. appear everywhere in physics).

When you come across a concept like this, you should really take the time to learn it well as this will help you make so many analogies and connections when it comes to more advanced topics.

Examples of this are the concepts of **energy** and **momentum**, which are used in every single area of physics.

A lesser-known example of a very ubiquitous concept is the **harmonic oscillator** (basically a “mass on a spring”), which surprisingly, shows up in quantum mechanics, atomic physics, quantum field theory and a lot of other areas.

This is nicely explained in the video below:

## Learn Dimensional Analysis

One of the most powerful tools in physics is **dimensional analysis**. The concept of dimensional analysis is very simple; **when we have an equation or a formula, the dimensions (i.e. units of measurement) of each term have to make sense**.

This is especially powerful for **verifying that an answer you get from a calculation is correct**. Simply check that all units in the answer make sense.

If they don’t, you know the answer has to be wrong in some way. If the units are indeed correct, it’s likely that the answer is also correct (you’d be surprised how often actually).

Here’s a couple of useful things to keep in mind when doing dimensional analysis:

- **Given an expression that has a sum of multiple terms** (of the form a+b), **the units have to be the same in all of the terms in the sum** (so here the units of a have to be the same as units of b). This is simply because we cannot just add a position (in meters) to a velocity (meters/second), it makes no sense physically.
- **The units on both sides of an equation have to match**. This may sound obvious (of course we can’t have a velocity being equal to an acceleration), but it often gets overlooked, leading to mistakes in calculations.
- **Use SI-units whenever possible**. The SI-system is specifically made for scientific use as it provides consistent relationships between different units as well as a useful prefix classification with powers of 10 (for example, mm corresponding to 10-3 m, meaning that the prefix “m” or “milli” indicates 10-3 of something).

The purpose of dimensional analysis is to give you a quick “consistency check” to see if your answer makes sense or not – if your units don’t make sense for a given expression, you immediately know the expression *has* to be wrong.

## Apply The Feynman Technique

The **Feynman technique** (named after the famous physicist Richard Feynman) is a strategy for learning that involves four steps:

1. **Study and learn a concept**.
2. **Teach the concept to someone else**.
3. **Fill in the possible gaps in your knowledge or explanations from the previous step**.
4. **Simplify the concept as much as possible** (but without reducing the content value).

For a nice, condensed explanation of the steps above, I recommend the following video:

Now, **the most important part of the Feynman technique is the teaching others -step**. Teaching a concept to someone else essentially *forces* you to understand the concept well yourself.

To be honest, **I have NEVER found a better way to learn something than to teach it to someone else in as simple of a way as possible**.

In fact, that is part of the goal with this website. I try to explain difficult concepts in an understandable way to help you, the reader, learn the concept but at the same time, I’m also learning the concept in a much deeper way and building my own understanding of it.

The way you could incorporate the Feynman technique is to simply **explain a concept to a friend**.

It could be a classmate or just a friend that doesn’t know anything about the topic (I promise that teaching a physics concept to someone who knows nothing about physics will challenge your own understanding in a way that nothing else compares to).

---

*← [Back to the full archive](../index.html)*
