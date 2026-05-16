# Generated migration for VIP tier expiry fields

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='vip_sure_draw_expiry',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Sure Draw VIP Expiry'),
        ),
        migrations.AddField(
            model_name='user',
            name='vip_ht_draw_expiry',
            field=models.DateTimeField(blank=True, null=True, verbose_name='HT Draw VIP Expiry'),
        ),
        migrations.AddField(
            model_name='user',
            name='vip_htft_draw_expiry',
            field=models.DateTimeField(blank=True, null=True, verbose_name='HT/FT Draw VIP Expiry'),
        ),
        migrations.AddField(
            model_name='user',
            name='vip_daily_fixed_expiry',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Daily Fixed Odd Expiry'),
        ),
    ]
