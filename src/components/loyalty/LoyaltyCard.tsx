import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLoyaltyPoints, useLoyaltyRewards, useRedeemReward, LoyaltyReward } from '@/hooks/useLoyalty';
import { Star, Gift, Loader2, Trophy } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

export function LoyaltyCard() {
  const { user } = useAuth();
  const { data: loyalty, isLoading: loadingPoints } = useLoyaltyPoints();
  const { data: rewards, isLoading: loadingRewards } = useLoyaltyRewards();
  const redeemReward = useRedeemReward();

  if (!user) {
    return (
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
        <CardContent className="p-6 text-center">
          <Star className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="font-display text-xl font-bold mb-2">Programa de Fidelidade</h3>
          <p className="text-muted-foreground mb-4">
            Faça login para acumular pontos e ganhar recompensas!
          </p>
          <Link to="/auth">
            <Button>Entrar</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (loadingPoints || loadingRewards) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const totalPoints = loyalty?.total_points || 0;
  const ordersCount = loyalty?.orders_count || 0;
  const nextFreePizza = 5;
  const ordersUntilFreePizza = Math.max(0, nextFreePizza - (ordersCount % nextFreePizza));
  const progressToFreePizza = ((ordersCount % nextFreePizza) / nextFreePizza) * 100;

  const handleRedeem = async (reward: LoyaltyReward) => {
    if (totalPoints < reward.points_required) return;
    await redeemReward.mutateAsync(reward);
  };

  return (
    <div className="space-y-4">
      {/* Card Principal */}
      <Card className="bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Programa de Fidelidade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pontos */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-card border">
            <div>
              <p className="text-sm text-muted-foreground">Seus pontos</p>
              <p className="text-3xl font-bold text-primary">{totalPoints}</p>
            </div>
            <Star className="h-10 w-10 text-primary/30" />
          </div>

          {/* Progresso para Pizza Grátis */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Próxima pizza grátis</span>
              <span className="font-medium">{ordersCount % nextFreePizza}/{nextFreePizza} pedidos</span>
            </div>
            <Progress value={progressToFreePizza} className="h-3" />
            <p className="text-xs text-muted-foreground">
              Faltam {ordersUntilFreePizza} pedido(s) para ganhar uma pizza grátis!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recompensas Disponíveis */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Resgatar Recompensas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rewards?.map((reward) => {
              const canRedeem = totalPoints >= reward.points_required;
              return (
                <div
                  key={reward.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    canRedeem ? 'bg-card hover:bg-muted' : 'bg-muted/50 opacity-60'
                  }`}
                >
                  <div>
                    <p className="font-medium">{reward.name}</p>
                    <p className="text-xs text-muted-foreground">{reward.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">
                      {reward.points_required} pts
                    </span>
                    <Button
                      size="sm"
                      disabled={!canRedeem || redeemReward.isPending}
                      onClick={() => handleRedeem(reward)}
                    >
                      {redeemReward.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Resgatar'
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
