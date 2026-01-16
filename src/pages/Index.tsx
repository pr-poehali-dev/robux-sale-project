import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
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

type Review = {
  id: number;
  name: string;
  rating: number;
  text: string;
  date: string;
};

type LogEntry = {
  id: number;
  timestamp: string;
  action: string;
  details: string;
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
  
  { id: "s1", name: "Starter Gold", amount: "1000 G", price: 821, game: "standoff" },
  { id: "s2", name: "Gold Pack", amount: "2500 G", price: 1721, oldPrice: 2180, badge: "ХИТ", game: "standoff" },
  { id: "s3", name: "Mega Gold", amount: "5000 G", price: 3080, oldPrice: 3980, badge: "ВЫГОДНО", game: "standoff" },
  { id: "s4", name: "Ultra Gold", amount: "10000 G", price: 5780, oldPrice: 8030, badge: "-28%", game: "standoff" },

  { id: "t1", name: "Starter Stars", amount: "15 ⭐", price: 99, game: "telegram" },
  { id: "t2", name: "Popular Stars", amount: "50 ⭐", price: 199, oldPrice: 250, badge: "ХИТ", game: "telegram" },
  { id: "t3", name: "Mega Stars", amount: "100 ⭐", price: 350, oldPrice: 450, game: "telegram" },
  { id: "t4", name: "Ultra Stars", amount: "250 ⭐", price: 750, oldPrice: 950, badge: "ВЫГОДНО", game: "telegram" },
];

const initialReviews: Review[] = [
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
  const [userEmail, setUserEmail] = useState("");
  const [currency, setCurrency] = useState<Currency>("RUB");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isPromoDialogOpen, setIsPromoDialogOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [isAdminPanel, setIsAdminPanel] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [robloxPassUrl, setRobloxPassUrl] = useState("");
  const [standoffId, setStandoffId] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedReviews = localStorage.getItem('rbshop_reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
    addLog("Система запущена", "Приложение загружено");
  }, []);

  const addLog = (action: string, details: string) => {
    const newLog: LogEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleString('ru-RU'),
      action,
      details,
    };
    setLogs(prev => [newLog, ...prev]);
    console.log(`[${newLog.timestamp}] ${action}: ${details}`);
  };

  const convertPrice = (price: number) => {
    return Math.round(price * currencyRates[currency]);
  };

  const formatPrice = (price: number) => {
    return `${convertPrice(price)}${currencySymbols[currency]}`;
  };

  const handlePromoCode = () => {
    addLog("Промокод введен", `Код: ${promoCode}`);
    if (promoCode === "RBSHOPADM") {
      setIsAdminPanel(true);
      setIsPromoDialogOpen(false);
      addLog("Админ-панель", "Доступ открыт");
      toast({
        title: "Админ-панель активирована! 🔓",
        description: "Все действия теперь логируются в консоль",
      });
    } else {
      addLog("Промокод неверный", `Попытка: ${promoCode}`);
      toast({
        title: "Неверный промокод",
        description: "Попробуйте другой код",
        variant: "destructive",
      });
    }
    setPromoCode("");
  };

  const addToCart = (product: Product) => {
    addLog("Добавление в корзину", `${product.name} - ${formatPrice(product.price)}`);
    
    if (!isLoggedIn) {
      addLog("Ошибка добавления", "Требуется авторизация");
      toast({
        title: "Требуется регистрация",
        description: "Зарегистрируйтесь или войдите, чтобы добавлять товары в корзину",
        variant: "destructive",
      });
      setIsAuthDialogOpen(true);
      return;
    }

    setCart([...cart, product]);
    addLog("Товар добавлен", `${product.name} от пользователя ${username}`);
    toast({
      title: "Добавлено в корзину! 🎮",
      description: `${product.name} - ${formatPrice(product.price)}`,
    });
  };

  const removeFromCart = (index: number) => {
    const item = cart[index];
    addLog("Удаление из корзины", `${item.name} - ${formatPrice(item.price)}`);
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    toast({
      title: "Удалено из корзины",
      description: "Товар успешно удален",
    });
  };

  const getTotalPrice = () => cart.reduce((sum, item) => sum + item.price, 0);

  const handleAuth = (name: string, email: string) => {
    addLog("Авторизация", `Пользователь: ${name}, Email: ${email}`);
    setUsername(name);
    setUserEmail(email);
    setIsLoggedIn(true);
    setIsAuthDialogOpen(false);
    toast({
      title: "Добро пожаловать! 🚀",
      description: `${name}, приятных покупок!`,
    });
  };

  const handleCheckout = () => {
    addLog("Оформление заказа", `Попытка оплаты на сумму ${formatPrice(getTotalPrice())}`);
    
    if (!cardNumber || cardNumber.length < 16) {
      addLog("Ошибка оплаты", "Некорректный номер карты");
      toast({
        title: "Ошибка",
        description: "Введите корректный номер карты",
        variant: "destructive",
      });
      return;
    }

    const robuxItems = cart.filter(item => item.game === "robux");
    const standoffItems = cart.filter(item => item.game === "standoff");
    const telegramItems = cart.filter(item => item.game === "telegram");

    if (robuxItems.length > 0 && !robloxPassUrl) {
      addLog("Ошибка оплаты", "Не указана ссылка на Roblox Pass");
      toast({
        title: "Ошибка",
        description: "Укажите ссылку на Roblox Game Pass для получения Robux",
        variant: "destructive",
      });
      return;
    }

    if (standoffItems.length > 0 && !standoffId) {
      addLog("Ошибка оплаты", "Не указан ID Standoff 2");
      toast({
        title: "Ошибка",
        description: "Укажите ваш ID в Standoff 2",
        variant: "destructive",
      });
      return;
    }

    if (telegramItems.length > 0 && !telegramUsername) {
      addLog("Ошибка оплаты", "Не указан Telegram Username");
      toast({
        title: "Ошибка",
        description: "Укажите ваш Username в Telegram",
        variant: "destructive",
      });
      return;
    }

    const orderDetails = cart.map(item => `${item.name} (${item.amount}) - ${formatPrice(item.price)}`).join('\n');
    let deliveryInfo = "\n\nДанные для доставки:\n";
    
    if (robuxItems.length > 0) {
      deliveryInfo += `Roblox Pass: ${robloxPassUrl}\n`;
    }
    if (standoffItems.length > 0) {
      deliveryInfo += `Standoff 2 ID: ${standoffId}\n`;
    }
    if (telegramItems.length > 0) {
      deliveryInfo += `Telegram: @${telegramUsername}\n`;
    }

    const telegramMessage = `🎮 Новый заказ!\n\nКлиент: ${username}\nEmail: ${userEmail}\n\nТовары:\n${orderDetails}\n\nИтого: ${formatPrice(getTotalPrice())}${deliveryInfo}`;
    
    addLog("Покупка совершена", `${username} купил на ${formatPrice(getTotalPrice())}`);
    addLog("Детали заказа", orderDetails);
    addLog("Данные доставки", deliveryInfo);
    
    const telegramUrl = `https://t.me/hellowen69?text=${encodeURIComponent(telegramMessage)}`;
    window.open(telegramUrl, '_blank');

    toast({
      title: "Успешно! ✅",
      description: `Оплата на сумму ${formatPrice(getTotalPrice())} прошла успешно! Товары будут доставлены в течение 5 минут.`,
    });

    setCart([]);
    setCardNumber("");
    setRobloxPassUrl("");
    setStandoffId("");
    setTelegramUsername("");
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
  };

  const handleAddReview = () => {
    addLog("Добавление отзыва", `Пользователь: ${username}, Рейтинг: ${newReviewRating}`);
    
    if (!isLoggedIn) {
      addLog("Ошибка отзыва", "Требуется авторизация");
      toast({
        title: "Требуется регистрация",
        description: "Войдите в аккаунт, чтобы оставить отзыв",
        variant: "destructive",
      });
      setIsAuthDialogOpen(true);
      return;
    }

    if (!newReviewText.trim()) {
      addLog("Ошибка отзыва", "Пустой текст отзыва");
      toast({
        title: "Ошибка",
        description: "Напишите текст отзыва",
        variant: "destructive",
      });
      return;
    }

    const newReview: Review = {
      id: Date.now(),
      name: username,
      rating: newReviewRating,
      text: newReviewText,
      date: new Date().toLocaleDateString('ru-RU'),
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem('rbshop_reviews', JSON.stringify(updatedReviews));

    addLog("Отзыв добавлен", `${username}: "${newReviewText.substring(0, 50)}..."`);

    toast({
      title: "Отзыв добавлен! ⭐",
      description: "Спасибо за ваш отзыв!",
    });

    setNewReviewText("");
    setNewReviewRating(5);
    setIsReviewDialogOpen(false);
  };

  const robuxProducts = products.filter(p => p.game === "robux");
  const standoffProducts = products.filter(p => p.game === "standoff");
  const telegramProducts = products.filter(p => p.game === "telegram");
  const dealsProducts = products.filter(p => p.badge && p.oldPrice);

  const renderProductCard = (product: Product) => (
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
  );

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
              {["home", "shop", "standoff", "telegram", "deals"].map((section) => (
                <button
                  key={section}
                  onClick={() => {
                    setActiveSection(section as typeof activeSection);
                    addLog("Навигация", `Переход на ${section}`);
                  }}
                  className={`transition-all ${activeSection === section ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {section === "home" && "Главная"}
                  {section === "shop" && "Robux"}
                  {section === "standoff" && "Standoff 2"}
                  {section === "telegram" && "Telegram Stars"}
                  {section === "deals" && "Акции"}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Dialog open={isPromoDialogOpen} onOpenChange={setIsPromoDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Icon name="Tag" size={20} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Введите промокод</DialogTitle>
                    <DialogDescription>Получите скидку или специальные возможности</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <Input
                      placeholder="Введите промокод"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    />
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary" onClick={handlePromoCode}>
                      <Icon name="CheckCircle" className="mr-2" size={18} />
                      Применить
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {isAdminPanel && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Icon name="Shield" size={20} />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[600px]">
                    <SheetHeader>
                      <SheetTitle>🔐 Админ-панель</SheetTitle>
                      <SheetDescription>Консоль логов всех действий</SheetDescription>
                    </SheetHeader>
                    <ScrollArea className="h-[calc(100vh-150px)] mt-6">
                      <div className="space-y-2">
                        {logs.map((log) => (
                          <Card key={log.id} className="p-3">
                            <div className="flex items-start gap-2">
                              <Icon name="Terminal" size={16} className="mt-1 text-primary" />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-bold text-primary">{log.action}</span>
                                  <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                                </div>
                                <p className="text-sm text-muted-foreground break-words">{log.details}</p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
              )}

              <Select value={currency} onValueChange={(val) => {
                setCurrency(val as Currency);
                addLog("Смена валюты", `Выбрана: ${val}`);
              }}>
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
                      <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg group">
                        <div className="flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.amount}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="font-bold text-primary">{formatPrice(item.price)}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeFromCart(index)}
                          >
                            <Icon name="Trash2" size={16} className="text-destructive" />
                          </Button>
                        </div>
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
                <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
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
                          onClick={() => {
                            const email = (document.getElementById('login-email') as HTMLInputElement)?.value;
                            if (email) handleAuth("Игрок", email);
                          }}
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
                          onClick={() => {
                            const name = (document.getElementById('reg-name') as HTMLInputElement)?.value;
                            const email = (document.getElementById('reg-email') as HTMLInputElement)?.value;
                            if (name && email) handleAuth(name, email);
                          }}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Оформление заказа</DialogTitle>
            <DialogDescription>Заполните все поля для успешной доставки</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Итого к оплате:</p>
              <p className="text-3xl font-bold text-primary">{formatPrice(getTotalPrice())}</p>
            </div>

            {cart.some(item => item.game === "robux") && (
              <div className="space-y-2">
                <Label htmlFor="roblox-pass">Ссылка на Roblox Game Pass</Label>
                <Input 
                  id="roblox-pass" 
                  placeholder="https://www.roblox.com/game-pass/..." 
                  value={robloxPassUrl}
                  onChange={(e) => setRobloxPassUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Robux будут зачислены через покупку Game Pass</p>
              </div>
            )}

            {cart.some(item => item.game === "standoff") && (
              <div className="space-y-2">
                <Label htmlFor="standoff-id">Ваш ID в Standoff 2</Label>
                <Input 
                  id="standoff-id" 
                  placeholder="Например: 12345678" 
                  value={standoffId}
                  onChange={(e) => setStandoffId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">ID можно найти в настройках профиля игры</p>
              </div>
            )}

            {cart.some(item => item.game === "telegram") && (
              <div className="space-y-2">
                <Label htmlFor="telegram-username">Username в Telegram</Label>
                <Input 
                  id="telegram-username" 
                  placeholder="Например: username" 
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value.replace('@', ''))}
                />
                <p className="text-xs text-muted-foreground">Укажите username без @</p>
              </div>
            )}

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

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Оставить отзыв</DialogTitle>
            <DialogDescription>Поделитесь своим мнением о нашем магазине</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Оценка</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewReviewRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Icon
                      name="Star"
                      size={32}
                      className={star <= newReviewRating ? "fill-secondary text-secondary" : "text-muted-foreground"}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-text">Ваш отзыв</Label>
              <Textarea
                id="review-text"
                placeholder="Напишите ваш отзыв..."
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                rows={4}
              />
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-primary to-secondary" 
              onClick={handleAddReview}
            >
              <Icon name="Send" className="mr-2" size={18} />
              Отправить отзыв
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
                {dealsProducts.slice(0, 3).map(renderProductCard)}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl font-heading font-bold">Отзывы наших клиентов</h2>
                <Button 
                  className="bg-gradient-to-r from-primary to-secondary"
                  onClick={() => {
                    if (!isLoggedIn) {
                      setIsAuthDialogOpen(true);
                    } else {
                      setIsReviewDialogOpen(true);
                    }
                  }}
                >
                  <Icon name="Plus" className="mr-2" size={18} />
                  Оставить отзыв
                </Button>
              </div>
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
              {robuxProducts.map(renderProductCard)}
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
              {standoffProducts.map(renderProductCard)}
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
              {telegramProducts.map(renderProductCard)}
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
                <li>
                  <a 
                    href="https://t.me/hellowen69" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <Icon name="MessageCircle" size={16} />
                    Telegram: @hellowen69
                  </a>
                </li>
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
