---
title: PyTorchで画像分類モデルを構築する
date: 2025-11-17
tags: [PyTorch, Deep Learning, Computer Vision, Tutorial]
colabUrl: https://colab.research.google.com/github/pytorch/tutorials/blob/gh-pages/_downloads/cifar10_tutorial.ipynb
demoUrl: https://huggingface.co/spaces/pytorch/ResNet-CIFAR10
repoUrl: https://github.com/pytorch/vision
---

# PyTorchで画像分類モデルを構築する

この記事では、PyTorchを使用してCIFAR-10データセットで画像分類モデルを構築する方法を学びます。初心者でも理解できるように、ステップバイステップで説明します。

## 概要

**CIFAR-10**は、機械学習の学習によく使われる画像データセットで、以下の10クラスの画像が含まれています：

- 飛行機 (airplane)
- 自動車 (automobile)
- 鳥 (bird)
- 猫 (cat)
- 鹿 (deer)
- 犬 (dog)
- カエル (frog)
- 馬 (horse)
- 船 (ship)
- トラック (truck)

各画像は32x32ピクセルのRGB画像で、合計60,000枚（訓練用50,000枚、テスト用10,000枚）が含まれています。

## 環境構築

### 必要なライブラリ

```bash
pip install torch torchvision matplotlib numpy
```

### インポート

```python
import torch
import torch.nn as nn
import torch.optim as optim
import torchvision
import torchvision.transforms as transforms
import matplotlib.pyplot as plt
import numpy as np
```

## データの準備

### データセットの読み込み

```python
# データ変換の定義
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
])

# 訓練データセット
trainset = torchvision.datasets.CIFAR10(
    root='./data',
    train=True,
    download=True,
    transform=transform
)

trainloader = torch.utils.data.DataLoader(
    trainset,
    batch_size=4,
    shuffle=True,
    num_workers=2
)

# テストデータセット
testset = torchvision.datasets.CIFAR10(
    root='./data',
    train=False,
    download=True,
    transform=transform
)

testloader = torch.utils.data.DataLoader(
    testset,
    batch_size=4,
    shuffle=False,
    num_workers=2
)

# クラス名
classes = ('plane', 'car', 'bird', 'cat', 'deer',
           'dog', 'frog', 'horse', 'ship', 'truck')
```

### データの可視化

```python
import matplotlib.pyplot as plt
import numpy as np

def imshow(img):
    img = img / 2 + 0.5  # 正規化を解除
    npimg = img.numpy()
    plt.imshow(np.transpose(npimg, (1, 2, 0)))
    plt.show()

# ランダムな訓練画像を取得
dataiter = iter(trainloader)
images, labels = next(dataiter)

# 画像を表示
imshow(torchvision.utils.make_grid(images))
print(' '.join(f'{classes[labels[j]]:5s}' for j in range(4)))
```

## モデルの定義

### CNNアーキテクチャ

```python
import torch.nn as nn
import torch.nn.functional as F

class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        # 畳み込み層
        self.conv1 = nn.Conv2d(3, 6, 5)
        self.pool = nn.MaxPool2d(2, 2)
        self.conv2 = nn.Conv2d(6, 16, 5)

        # 全結合層
        self.fc1 = nn.Linear(16 * 5 * 5, 120)
        self.fc2 = nn.Linear(120, 84)
        self.fc3 = nn.Linear(84, 10)

    def forward(self, x):
        # 畳み込み + プーリング
        x = self.pool(F.relu(self.conv1(x)))
        x = self.pool(F.relu(self.conv2(x)))

        # 平坦化
        x = x.view(-1, 16 * 5 * 5)

        # 全結合層
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = self.fc3(x)
        return x

net = Net()
```

### モデルの構造

ネットワークは以下の構造になっています：

1. **入力層**: 32x32x3（RGB画像）
2. **畳み込み層1**: 6フィルター、5x5カーネル
3. **プーリング層1**: 2x2 Max Pooling
4. **畳み込み層2**: 16フィルター、5x5カーネル
5. **プーリング層2**: 2x2 Max Pooling
6. **全結合層1**: 120ユニット
7. **全結合層2**: 84ユニット
8. **出力層**: 10ユニット（10クラス）

## 損失関数と最適化

```python
import torch.optim as optim

# 損失関数: Cross Entropy Loss
criterion = nn.CrossEntropyLoss()

# 最適化手法: SGD with momentum
optimizer = optim.SGD(net.parameters(), lr=0.001, momentum=0.9)
```

## 訓練

```python
# GPUが利用可能な場合はGPUを使用
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
net.to(device)

# 訓練ループ
for epoch in range(2):  # データセットを2回通す
    running_loss = 0.0

    for i, data in enumerate(trainloader, 0):
        # データを取得
        inputs, labels = data
        inputs, labels = inputs.to(device), labels.to(device)

        # 勾配をゼロに初期化
        optimizer.zero_grad()

        # 順伝播 + 逆伝播 + 最適化
        outputs = net(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        # 統計情報の出力
        running_loss += loss.item()
        if i % 2000 == 1999:
            print(f'[{epoch + 1}, {i + 1:5d}] loss: {running_loss / 2000:.3f}')
            running_loss = 0.0

print('訓練完了')
```

### 訓練の結果

```
[1,  2000] loss: 2.183
[1,  4000] loss: 1.864
[1,  6000] loss: 1.672
[1,  8000] loss: 1.572
[1, 10000] loss: 1.512
[1, 12000] loss: 1.465
[2,  2000] loss: 1.402
[2,  4000] loss: 1.377
[2,  6000] loss: 1.363
[2,  8000] loss: 1.330
[2, 10000] loss: 1.314
[2, 12000] loss: 1.295
訓練完了
```

## モデルの評価

### テストセットでの精度

```python
correct = 0
total = 0

# 評価モード（勾配計算なし）
with torch.no_grad():
    for data in testloader:
        images, labels = data
        images, labels = images.to(device), labels.to(device)

        outputs = net(images)
        _, predicted = torch.max(outputs.data, 1)

        total += labels.size(0)
        correct += (predicted == labels).sum().item()

print(f'テストセット10000枚に対する精度: {100 * correct / total:.2f}%')
```

### クラスごとの精度

```python
class_correct = list(0. for i in range(10))
class_total = list(0. for i in range(10))

with torch.no_grad():
    for data in testloader:
        images, labels = data
        images, labels = images.to(device), labels.to(device)

        outputs = net(images)
        _, predicted = torch.max(outputs, 1)

        c = (predicted == labels).squeeze()
        for i in range(4):
            label = labels[i]
            class_correct[label] += c[i].item()
            class_total[label] += 1

# クラスごとの精度を表示
for i in range(10):
    accuracy = 100 * class_correct[i] / class_total[i]
    print(f'{classes[i]:5s}の精度: {accuracy:.2f}%')
```

## モデルの保存

```python
# モデルの保存
PATH = './cifar_net.pth'
torch.save(net.state_dict(), PATH)

# モデルの読み込み
net = Net()
net.load_state_dict(torch.load(PATH))
```

## 推論

```python
# テスト画像を取得
dataiter = iter(testloader)
images, labels = next(dataiter)

# 画像を表示
imshow(torchvision.utils.make_grid(images))
print('正解: ', ' '.join(f'{classes[labels[j]]:5s}' for j in range(4)))

# 推論
images = images.to(device)
outputs = net(images)
_, predicted = torch.max(outputs, 1)

print('予測: ', ' '.join(f'{classes[predicted[j]]:5s}' for j in range(4)))
```

## パフォーマンス改善のヒント

### 1. データ拡張

```python
transform_train = transforms.Compose([
    transforms.RandomCrop(32, padding=4),
    transforms.RandomHorizontalFlip(),
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5)),
])
```

### 2. より深いネットワーク

ResNetやVGGなどの事前学習済みモデルを使用：

```python
import torchvision.models as models

resnet18 = models.resnet18(pretrained=True)
resnet18.fc = nn.Linear(512, 10)  # 出力層を10クラスに変更
```

### 3. 学習率スケジューリング

```python
scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=7, gamma=0.1)
```

## まとめ

このチュートリアルでは、以下を学びました：

1. ✅ CIFAR-10データセットの読み込み
2. ✅ CNNモデルの定義
3. ✅ モデルの訓練
4. ✅ モデルの評価
5. ✅ モデルの保存と読み込み

次のステップとして、以下を試してみてください：

- より深いネットワーク（ResNet、VGGなど）の使用
- データ拡張の適用
- 異なる最適化手法の試行
- ハイパーパラメータのチューニング

## 参考資料

- [PyTorch公式チュートリアル](https://pytorch.org/tutorials/)
- [CIFAR-10データセット](https://www.cs.toronto.edu/~kriz/cifar.html)
- [畳み込みニューラルネットワークの基礎](https://cs231n.github.io/)
