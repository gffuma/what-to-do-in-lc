<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
  <title>What to do in LC&#9889;Dashboard</title>
  <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
  <link rel="icon" href="favicon.ico" type="image/x-icon">

	<link href="/css/dashboard/app.css" rel="stylesheet">
</head>
<body>

  <div id="react-root">
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="/">What to do in LC &#9889; Dashboard</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li><a href="/events">le Events</a></li>
            <li><a href="/import">Import</a></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>

    <div class="container">
      @for ($i = 0; $i < rand(3, 60); $i++)
        &#128640;
      @endfor
    </div>
  </div>

  <script>
    window.__INITIAL_STATE__ = {!! json_encode($initialState) !!};
  </script>
  <script src="/js/dashboard/app.js"></script>
  <script src="{{ $bundleSrc }}"></script>
</body>
</html>
