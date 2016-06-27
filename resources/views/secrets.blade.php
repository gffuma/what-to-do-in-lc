

<h1>W3lc0m3 1n th3 D4rk S1d3</h1>

@foreach ($categories as $category)
  {{ $category->name }} {{ $category->events->count() }}

  @foreach ($category->events as $event)
    <div>
    {{ $event->name }}
    </div>
  @endforeach


<br />

@endforeach
