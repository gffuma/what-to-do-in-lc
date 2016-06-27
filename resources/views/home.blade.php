

@foreach ($events as $event)
{{ $event->name }}
{{ $event->start_time }}
<br />

@endforeach
