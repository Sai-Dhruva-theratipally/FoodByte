param(
  [string]$BaseUrl = "http://localhost:8080/api",
  [string]$Password = "Passw0rd!"
)

$ErrorActionPreference = "Stop"

function Write-Step([string]$Message) {
  Write-Host "==> $Message"
}

function Invoke-Json([string]$Method, [string]$Path, $Body = $null, $Headers = @{}) {
  $uri = "$BaseUrl$Path"
  if ($null -ne $Body) {
    return Invoke-RestMethod -Method $Method -Uri $uri -Headers $Headers -ContentType "application/json" -Body ($Body | ConvertTo-Json -Depth 10)
  }
  return Invoke-RestMethod -Method $Method -Uri $uri -Headers $Headers
}

Write-Step "Health"
$health = Invoke-Json "GET" "/health"
Write-Host "health.status = $($health.status)"

$email = "user_$([guid]::NewGuid().ToString('N').Substring(0,10))@example.com"
$name = "FoodByte User"

Write-Step "Register ($email)"
$reg = Invoke-Json "POST" "/auth/register" @{ email = $email; name = $name; password = $Password }
if (-not $reg.token) { throw "Register did not return token" }

Write-Step "Login"
$login = Invoke-Json "POST" "/auth/login" @{ email = $email; password = $Password }
if (-not $login.token) { throw "Login did not return token" }

$authHeaders = @{ Authorization = "Bearer $($login.token)" }

Write-Step "Restaurants"
$restaurants = Invoke-Json "GET" "/restaurants"
Write-Host "restaurants.count = $($restaurants.Count)"

Write-Step "Products"
$products = Invoke-Json "GET" "/products"
Write-Host "products.count = $($products.Count)"

Write-Step "Cart (GET)"
$cart = Invoke-Json "GET" "/cart" $null $authHeaders
Write-Host "cart.id = $($cart.id)"
Write-Host "cart.items.count = $($cart.items.Count)"

Write-Step "Orders (history)"
$history = Invoke-Json "GET" "/orders/history" $null $authHeaders
Write-Host "orders.history.count = $($history.Count)"

Write-Host ""
Write-Host "Smoke test OK" -ForegroundColor Green
