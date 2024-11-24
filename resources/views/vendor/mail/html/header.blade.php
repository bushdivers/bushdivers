@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
    @if (config('app.logo_url'))
    <img src="{{ config('app.logo_url') }}" class="logo" alt="Bushdivers Logo">
    @else
    {{ $slot }}
    @endif
</a>
</td>
</tr>
