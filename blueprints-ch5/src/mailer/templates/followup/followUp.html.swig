<h4 class="title">
  Hey {{user1.name}},
</h4>
<div class="text">
  We hope you just had an awesome meeting with {{user2.name}}!
  You guys were supposed to meetup at {{date|date('jS \o\f F H:i')}}, how did it go?
</div>
<ul>
  {% for id, text in outcomes %}
  <li><a href="http://127.0.0.1:8000/followup/{{meetingId}}/{{user2._id.toString()}}/{{id}}">{{text}}</a></li>
  {% endfor %}
</ul>
<div class="text">
  Hope to see you back soon!
</div>