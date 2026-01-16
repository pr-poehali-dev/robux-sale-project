import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

type Product = {
  id: string;
  name: string;
  amount: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  game: "robux" | "standoff" | "telegram";
};

type Currency = "RUB" | "EUR" | "UAH";

const currencyRates: Record<Currency, number> = {
  RUB: 1,
  EUR: 0.01,
  UAH: 0.4,
};

const currencySymbols: Record<Currency, string> = {
  RUB: "₽",
  EUR: "€",
  UAH: "₴",
};

const products: Product[] = [
  { id: "1", name: "Starter Pack", amount: "100 RB", price: 100, game: "robux" },
  { id: "2", name: "Popular", amount: "170 RB", price: 120, oldPrice: 150, badge: "ХИТ", game: "robux" },
  { id: "3", name: "Advanced", amount: "350 RB", price: 230, oldPrice: 300, game: "robux" },
  { id: "4", name: "Pro Pack", amount: "800 RB", price: 500, oldPrice: 650, badge: "ВЫГОДНО", game: "robux" },
  { id: "5", name: "Mega Pack", amount: "1700 RB", price: 900, oldPrice: 1200, badge: "-25%", game: "robux" },
  { id: "6", name: "Ultra Pack", amount: "4500 RB", price: 2100, oldPrice: 2800, game: "robux" },
  
  { id: "s1", name: "Starter Gold", amount: "1000 G", price: 297, game: "standoff" },
  { id: "s2", name: "Gold Pack", amount: "2500 G", price: 597, oldPrice: 750, badge: "ХИТ", game: "standoff" },
  { id: "s3", name: "Mega Gold", amount: "5000 G", price: 1050, oldPrice: 1350, badge: "ВЫГОДНО", game: "standoff" },
  { id: "s4", name: "Ultra Gold", amount: "10000 G", price: 1950, oldPrice: 2700, badge: "-28%", game: "standoff" },

  { id: "t1", name: "Starter Stars", amount: "15 ⭐", price: 99, game: "telegram" },
  { id: "t2", name: "Popular Stars", amount: "50 ⭐", price: 199, oldPrice: 250, badge: "ХИТ", game: "telegram" },
  { id: "t3", name: "Mega Stars", amount: "100 ⭐", price: 350, oldPrice: 450, game: "telegram" },
  { id: "t4", name: "Ultra Stars", amount: "250 ⭐", price: 750, oldPrice: 950, badge: "ВЫГОДНО", game: "telegram" },
];

const reviews = [
  { id: 1, name: "Александр", rating: 5, text: "Отличный магазин! Робуксы пришли моментально, цены реально ниже чем везде!", date: "15.01.2026" },
  { id: 2, name: "Мария", rating: 5, text: "Покупала голду для Standoff 2, всё быстро и без проблем. Рекомендую!", date: "14.01.2026" },
  { id: 3, name: "Дмитрий", rating: 5, text: "Звезды для Telegram пришли за минуту. Поддержка отвечает быстро. Супер!", date: "13.01.2026" },
  { id: 4, name: "Анна", rating: 5, text: "Самые низкие цены! Уже третий раз покупаю, всегда всё отлично 🔥", date: "12.01.2026" },
  { id: 5, name: "Игорь", rating: 5, text: "Быстро, надежно, дешево. Что еще нужно? Всем советую!", date: "11.01.2026" },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState<"home" | "shop" | "standoff" | "deals" | "telegram">("home");
  const [cart, setCart] = useState<Product[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [currency, setCurrency] = useState<Currency>("RUB");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  const convertPrice = (price: number) => {
    return Math.round(price * currencyRates[currency]);
  };

  const formatPrice = (price: number) => {
    return `${convertPrice(price)}${currencySymbols[currency]}`;
  };

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    toast({
      title: "Добавлено в корзину! 🎮",
      description: `${product.name} - ${formatPrice(product.price)}`,
    });
  };

  const getTotalPrice = () => cart.reduce((sum, item) => sum + item.price, 0);

  const handleAuth = (name: string) => {
    setUsername(name);
    setIsLoggedIn(true);
    toast({
      title: "Добро пожаловать! 🚀",
      description: `${name}, приятных покупок!`,
    });
  };

  const handleCheckout = () => {
    if (!cardNumber || cardNumber.length < 16) {
      toast({
        title: "Ошибка",
        description: "Введите корректный номер карты",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Успешно! ✅",
      description: `Оплата на сумму ${formatPrice(getTotalPrice())} прошла успешно! Товары будут доставлены в течение 5 минут.`,
    });

    setCart([]);
    setCardNumber("");
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
  };

  const robuxProducts = products.filter(p => p.game === "robux");
  const standoffProducts = products.filter(p => p.game === "standoff");
  const telegramProducts = products.filter(p => p.game === "telegram");
  const dealsProducts = products.filter(p => p.badge && p.oldPrice);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-card/80 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center animate-glow">
                <Icon name="Gamepad2" className="text-white" size={24} />
              </div>
              <span className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                RBShop
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setActiveSection("home")}
                className={`transition-all ${activeSection === "home" ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}
              >
                Главная
              </button>
              <button
                onClick={() => setActiveSection("shop")}
                className={`transition-all ${activeSection === "shop" ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}
              >
                Robux
              </button>
              <button
                onClick={() => setActiveSection("standoff")}
                className={`transition-all ${activeSection === "standoff" ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}
              >
                Standoff 2
              </button>
              <button
                onClick={() => setActiveSection("telegram")}
                className={`transition-all ${activeSection === "telegram" ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}
              >
                Telegram Stars
              </button>
              <button
                onClick={() => setActiveSection("deals")}
                className={`transition-all ${activeSection === "deals" ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}
              >
                Акции
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Select value={currency} onValueChange={(val) => setCurrency(val as Currency)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RUB">₽ RUB</SelectItem>
                  <SelectItem value="EUR">€ EUR</SelectItem>
                  <SelectItem value="UAH">₴ UAH</SelectItem>
                </SelectContent>
              </Select>

              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Icon name="ShoppingCart" size={20} />
                    {cart.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 bg-secondary">
                        {cart.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Корзина</SheetTitle>
                    <SheetDescription>
                      {cart.length === 0 ? "Корзина пуста" : `${cart.length} товар(ов)`}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.amount}</p>
                        </div>
                        <p className="font-bold text-primary">{formatPrice(item.price)}</p>
                      </div>
                    ))}
                    {cart.length > 0 && (
                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-bold">Итого:</span>
                          <span className="text-2xl font-bold text-primary">{formatPrice(getTotalPrice())}</span>
                        </div>
                        <Button 
                          className="w-full bg-gradient-to-r from-primary to-secondary" 
                          size="lg"
                          onClick={() => setIsCheckoutOpen(true)}
                        >
                          <Icon name="CreditCard" className="mr-2" size={18} />
                          Оформить заказ
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {isLoggedIn ? (
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                  <Icon name="User" size={18} />
                  <span className="text-sm font-medium">{username}</span>
                </div>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="hidden md:flex bg-gradient-to-r from-primary to-secondary">
                      <Icon name="LogIn" className="mr-2" size={18} />
                      Войти
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Вход в аккаунт</DialogTitle>
                      <DialogDescription>Войдите или создайте новый аккаунт</DialogDescription>
                    </DialogHeader>
                    <Tabs defaultValue="login" className="mt-4">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Вход</TabsTrigger>
                        <TabsTrigger value="register">Регистрация</TabsTrigger>
                      </TabsList>
                      <TabsContent value="login" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-email">Email</Label>
                          <Input id="login-email" type="email" placeholder="example@mail.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="login-password">Пароль</Label>
                          <Input id="login-password" type="password" placeholder="••••••••" />
                        </div>
                        <Button
                          className="w-full bg-gradient-to-r from-primary to-secondary"
                          onClick={() => handleAuth("Игрок")}
                        >
                          Войти
                        </Button>
                      </TabsContent>
                      <TabsContent value="register" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="reg-name">Имя пользователя</Label>
                          <Input id="reg-name" placeholder="Ваше имя" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-email">Email</Label>
                          <Input id="reg-email" type="email" placeholder="example@mail.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-password">Пароль</Label>
                          <Input id="reg-password" type="password" placeholder="••••••••" />
                        </div>
                        <Button
                          className="w-full bg-gradient-to-r from-primary to-secondary"
                          onClick={() => handleAuth("Новичок")}
                        >
                          Зарегистрироваться
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Оформление заказа</DialogTitle>
            <DialogDescription>Введите данные карты для оплаты</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Итого к оплате:</p>
              <p className="text-3xl font-bold text-primary">{formatPrice(getTotalPrice())}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-number">Номер карты</Label>
              <Input 
                id="card-number" 
                placeholder="1234 5678 9012 3456" 
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
                maxLength={16}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Срок действия</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" maxLength={3} />
              </div>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-primary to-secondary" 
              size="lg"
              onClick={handleCheckout}
            >
              <Icon name="CheckCircle" className="mr-2" size={18} />
              Оплатить {formatPrice(getTotalPrice())}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <main className="container mx-auto px-4 py-12">
        {activeSection === "home" && (
          <div className="space-y-16 animate-fade-in">
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 p-12 md:p-20">
              <div className="relative z-10 max-w-3xl">
                <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Игровая валюта по лучшим ценам!
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Robux для Roblox, голда для Standoff 2 и звезды для Telegram. Мгновенная доставка, безопасные платежи.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-secondary" onClick={() => setActiveSection("shop")}>
                    <Icon name="ShoppingBag" className="mr-2" size={20} />
                    В магазин
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => setActiveSection("deals")}>
                    <Icon name="Gift" className="mr-2" size={20} />
                    Акции
                  </Button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-glow" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-glow" style={{ animationDelay: "1s" }} />
            </section>

            <section>
              <h2 className="text-4xl font-heading font-bold mb-8">Популярные предложения</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dealsProducts.slice(0, 3).map((product) => (
                  <Card key={product.id} className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 border-2 border-primary/20">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-2xl font-heading">{product.name}</CardTitle>
                        {product.badge && (
                          <Badge className="bg-secondary text-secondary-foreground">{product.badge}</Badge>
                        )}
                      </div>
                      <CardDescription className="text-3xl font-bold text-primary">{product.amount}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-bold">{formatPrice(product.price)}</span>
                        {product.oldPrice && (
                          <span className="text-xl text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-gradient-to-r from-primary to-secondary group-hover:shadow-lg" onClick={() => addToCart(product)}>
                        <Icon name="ShoppingCart" className="mr-2" size={18} />
                        Купить
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-4xl font-heading font-bold mb-8">Отзывы наших клиентов</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                  <Card key={review.id} className="hover:scale-105 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{review.name}</CardTitle>
                        <div className="flex gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Icon key={i} name="Star" size={16} className="fill-secondary text-secondary" />
                          ))}
                        </div>
                      </div>
                      <CardDescription className="text-xs">{review.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{review.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeSection === "shop" && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Магазин Robux
              </h1>
              <p className="text-xl text-muted-foreground">Выберите подходящий пакет для Roblox</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {robuxProducts.map((product) => (
                <Card key={product.id} className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-2xl font-heading">{product.name}</CardTitle>
                      {product.badge && (
                        <Badge className="bg-secondary text-secondary-foreground">{product.badge}</Badge>
                      )}
                    </div>
                    <CardDescription className="text-3xl font-bold text-primary">{product.amount}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold">{formatPrice(product.price)}</span>
                      {product.oldPrice && (
                        <span className="text-xl text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary" onClick={() => addToCart(product)}>
                      <Icon name="ShoppingCart" className="mr-2" size={18} />
                      Добавить
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === "standoff" && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                Standoff 2 Gold
              </h1>
              <p className="text-xl text-muted-foreground">Пополните золото для Standoff 2</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {standoffProducts.map((product) => (
                <Card key={product.id} className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-2xl font-heading">{product.name}</CardTitle>
                      {product.badge && (
                        <Badge className="bg-secondary text-secondary-foreground">{product.badge}</Badge>
                      )}
                    </div>
                    <CardDescription className="text-3xl font-bold text-accent">{product.amount}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold">{formatPrice(product.price)}</span>
                      {product.oldPrice && (
                        <span className="text-xl text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-accent to-secondary" onClick={() => addToCart(product)}>
                      <Icon name="ShoppingCart" className="mr-2" size={18} />
                      Добавить
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === "telegram" && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Telegram Stars ⭐
              </h1>
              <p className="text-xl text-muted-foreground">Покупайте звезды для Telegram по выгодным ценам</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {telegramProducts.map((product) => (
                <Card key={product.id} className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-2xl font-heading">{product.name}</CardTitle>
                      {product.badge && (
                        <Badge className="bg-secondary text-secondary-foreground">{product.badge}</Badge>
                      )}
                    </div>
                    <CardDescription className="text-3xl font-bold text-accent">{product.amount}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold">{formatPrice(product.price)}</span>
                      {product.oldPrice && (
                        <span className="text-xl text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-accent to-primary" onClick={() => addToCart(product)}>
                      <Icon name="ShoppingCart" className="mr-2" size={18} />
                      Добавить
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === "deals" && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                Акции и предложения
              </h1>
              <p className="text-xl text-muted-foreground">Специальные предложения с максимальной выгодой!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dealsProducts.map((product) => (
                <Card key={product.id} className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-secondary/20 border-2 border-secondary/30">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-2xl font-heading">{product.name}</CardTitle>
                      {product.badge && (
                        <Badge className="bg-secondary text-secondary-foreground animate-glow">{product.badge}</Badge>
                      )}
                    </div>
                    <CardDescription className="text-3xl font-bold text-primary">{product.amount}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold">{formatPrice(product.price)}</span>
                      {product.oldPrice && (
                        <span className="text-xl text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
                      )}
                    </div>
                    <p className="text-sm text-secondary font-semibold mt-2">
                      Экономия: {formatPrice(product.oldPrice! - product.price)}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-secondary to-primary group-hover:shadow-lg" onClick={() => addToCart(product)}>
                      <Icon name="Zap" className="mr-2" size={18} />
                      Купить выгодно
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Icon name="Gamepad2" className="text-white" size={24} />
                </div>
                <span className="text-xl font-heading font-bold">RBShop</span>
              </div>
              <p className="text-muted-foreground">Лучшие цены на игровую валюту. Быстро и безопасно.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Разделы</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><button onClick={() => setActiveSection("shop")} className="hover:text-primary transition-colors">Robux</button></li>
                <li><button onClick={() => setActiveSection("standoff")} className="hover:text-primary transition-colors">Standoff 2</button></li>
                <li><button onClick={() => setActiveSection("telegram")} className="hover:text-primary transition-colors">Telegram Stars</button></li>
                <li><button onClick={() => setActiveSection("deals")} className="hover:text-primary transition-colors">Акции</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Поддержка</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="hover:text-primary transition-colors cursor-pointer">FAQ</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Связаться с нами</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Политика возврата</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>© 2026 RBShop. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
