# Zero layer - Alexa skill definition

The first layer of this app is the Amazon skill definition. It has all the information about natural language commands we plan to handle. Also, it has a service hook definition which will receive Alexa's calls.

You have a good tutorial covering this part you can find on [YouTube](https://www.youtube.com/watch?v=zt9WdE5kR6g) (it is probably outdated though)

In my case, I want to handle the following messages

* Play control: play, pause, resume, stop
* Volume control: set specific volume, mute, increase and decrease volume
* Play radio from my favorites list, identified just by slot number
* Play the audio track in the same manner

## Service hook

I decided to host the service as an Amazon lambda function. 

* It is very well covered in tutorials and is sort of the default choice
* For my volumes it is free
* Practical experience using Amazon lambda functions

## Setup 

1. Go to [Amazon Dev Console/ Alexa](https://developer.amazon.com/edw/home.html#/skills) and create skill using step by step routine
2. Use schema and sample utterances from this folder 
3. Enable skill at [your profile page](https://alexa.amazon.com/spa/index.html#skills/your-skills/?ref-suffix=ysa_gw)

## Links

* [Amazon dev Console - starting point](https://developer.amazon.com/alexa/console/ask)
* [Amazon Skill Model docs](https://developer.amazon.com/docs/custom-skills/define-the-interaction-model-in-json-and-text.html)
* [YouTube tutorial](https://www.youtube.com/watch?time_continue=39&v=zt9WdE5kR6g)

please go to the [next layer](../01-mopidy-voice-control-skill) for more

## Screenshots

![image](https://github.com/sonocotta/mopidy-alexa-voice-control/assets/5459747/e8aa6eb6-4401-43ad-b4b7-e32bf3f3dbbe)
![image](https://github.com/sonocotta/mopidy-alexa-voice-control/assets/5459747/3a47f1dc-ea06-42f2-bcb1-079607d8cc67)
